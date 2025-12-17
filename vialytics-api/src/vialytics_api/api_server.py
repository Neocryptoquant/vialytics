from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import threading

from vialytics_api.services.analytics import WalletAnalyzer
from vialytics_api.services.supabase_service import get_supabase
from vialytics_api.services.indexer_service import get_indexer, DATA_DIR
from vialytics_api.services.helius_client import get_default_client
from fastapi.concurrency import run_in_threadpool

app = FastAPI(title="Vialytics API")

@app.get("/health")
async def health_check():
    """Simple health check endpoint for Railway"""
    return {"status": "healthy", "service": "vialytics-api"}

# CORS configuration - allow vialytics.xyz and localhost for dev
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://vialytics.xyz",
    "https://www.vialytics.xyz",
    "https://*.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = get_supabase()
indexer = get_indexer()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    response: str

class IndexRequest(BaseModel):
    wallet_address: str

class IndexResponse(BaseModel):
    job_id: str
    status: str

class JobStatus(BaseModel):
    job_id: str
    status: str
    progress: int
    error: Optional[str] = None

@app.post("/api/index")
async def start_indexing(request: IndexRequest, background_tasks: BackgroundTasks) -> IndexResponse:
    """Trigger wallet indexing"""
    wallet = request.wallet_address
    
    # Validate
    if not (32 <= len(wallet) <= 44):
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    
    # Check if already cached
    cached = supabase.get_analytics(wallet)
    if cached:
        return IndexResponse(job_id="cached", status="completed")
    
    # Create job
    job_id = supabase.create_job(wallet) if supabase.client else wallet[:8]
    
    # Run indexer in background thread
    def run_in_background():
        try:
            indexer.run_indexer(wallet, job_id)
        except Exception as e:
            print(f"Background indexer error: {e}")
    
    thread = threading.Thread(target=run_in_background)
    thread.daemon = True
    thread.start()
    
    return IndexResponse(job_id=job_id, status="running")

@app.get("/api/index/status/{job_id}")
async def get_index_status(job_id: str) -> JobStatus:
    """Check indexing job status"""
    
    # Check for cached status
    if job_id == "cached":
        return JobStatus(job_id=job_id, status="completed", progress=100)
    
    # Get from Supabase
    if supabase.client:
        job = supabase.get_job_status(job_id)
        if job:
            return JobStatus(
                job_id=job_id,
                status=job["status"],
                progress=job["progress"],
                error=job.get("error_message")
            )
    
    # Fallback: simulate progress for demo
    return JobStatus(job_id=job_id, status="completed", progress=100)

@app.get("/api/analytics/{wallet_address}")
async def get_analytics_by_wallet(wallet_address: str) -> Dict[str, Any]:
    """Get analytics for a specific wallet with Helius-only fallback for MVP"""
    
    # Validate wallet address
    if not (32 <= len(wallet_address) <= 44):
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    
    # Check Supabase cache first
    if supabase.client:
        cached = supabase.get_analytics(wallet_address)
        if cached:
            return cached
    
    # Per-wallet database path
    db_path = os.path.join(DATA_DIR, f"{wallet_address}.db")
    
    # Initialize response with basic wallet info
    result: Dict[str, Any] = {
        "wallet_address": wallet_address,
        "data_source": "helius",  # Track data source for debugging
    }
    
    # Try to get indexed data first
    if os.path.exists(db_path):
        try:
            analyzer = WalletAnalyzer(db_path=db_path)
            indexed_data = analyzer.analyze()
            result.update(indexed_data)
            result["data_source"] = "indexed"
        except Exception as e:
            print(f"Indexed analytics error: {e}")
    
    # Always enrich with Helius/Orb data (this is our primary source for MVP)
    try:
        client = get_default_client()
        enrichment = await run_in_threadpool(client.fetch_enrichment, wallet_address)
        if enrichment:
            result.setdefault("external_sources", {})["helius_orb"] = enrichment
            
            # If we don't have indexed data, build analytics from Helius data
            if result.get("data_source") == "helius":
                normalized = enrichment.get("normalized", {})
                token_balances = normalized.get("token_balances", [])
                
                # Build complete structure expected by frontend
                result["portfolio_overview"] = {
                    "total_balance_usd": sum(t.get("usd_value", 0) for t in token_balances),
                    "token_count": len(token_balances),
                    "nft_count": len(normalized.get("nfts", [])),
                    "top_tokens": token_balances[:5] if token_balances else [],
                }
                result["earnings_spending"] = {
                    "total_received_usd": 0,
                    "total_sent_usd": 0,
                    "net_flow": 0,
                }
                result["activity_insights"] = {
                    "total_transactions": len(enrichment.get("transactions", [])),
                    "active_days_count": 0,
                    "monthly_frequency": {},  # Empty dict instead of None
                    "top_counterparties": normalized.get("top_counterparties", [])[:5],
                }
    except Exception as e:
        print(f"Helius enrichment error: {e}")
        # If Helius fails and we have no indexed data, return minimal structure
        if result.get("data_source") == "helius" and "portfolio_overview" not in result:
            raise HTTPException(status_code=503, detail="Unable to fetch wallet data. Please try again.")

    return result

@app.get("/api/enrichment/{wallet_address}")
async def get_enrichment(wallet_address: str) -> Dict[str, Any]:
    """Get Helius enrichment data for a wallet (token balances, NFTs, labels)."""
    if not (32 <= len(wallet_address) <= 44):
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    
    try:
        client = get_default_client()
        enrichment = await run_in_threadpool(client.fetch_enrichment, wallet_address)
        return enrichment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enrichment failed: {e}")

@app.get("/api/analytics")
async def get_analytics() -> Dict[str, Any]:
    """Get analytics for default wallet (legacy endpoint) - redirects to Helius-only mode"""
    raise HTTPException(status_code=400, detail="Please use /api/analytics/{wallet_address} endpoint")

@app.post("/api/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    user_message = request.messages[-1].content if request.messages else ""
    
    if "balance" in user_message.lower():
        response = "Let me check your portfolio balance for you!"
    elif "transaction" in user_message.lower():
        response = "I can help you understand your transaction history. What would you like to know?"
    elif "hello" in user_message.lower() or "hi" in user_message.lower():
        response = "Hey there! I'm Via, your friendly wallet assistant. How can I help you today?"
    else:
        response = f"I heard you say: '{user_message}'. I'm here to help with your wallet analytics!"
    
    return ChatResponse(response=response)

@app.get("/api/news")
async def get_solana_news():
    import requests
    
    try:
        url = "https://min-api.cryptocompare.com/data/v2/news/"
        params = {
            "categories": "SOL,Blockchain",
            "lang": "EN"
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        news_items = []
        for item in data.get("Data", [])[:5]:
            news_items.append({
                "title": item.get("title", ""),
                "body": item.get("body", "")[:150] + "...",
                "url": item.get("url", ""),
                "source": item.get("source", ""),
                "published_on": item.get("published_on", 0)
            })
        
        return {"news": news_items}
    except Exception as e:
        print(f"Error fetching news: {e}")
        return {"news": []}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
