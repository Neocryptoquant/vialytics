from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import threading

from vialytics_api.services.analytics import WalletAnalyzer
from vialytics_api.services.supabase_service import get_supabase
from vialytics_api.services.indexer_service import get_indexer

app = FastAPI(title="Vialytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    """Get analytics for a specific wallet"""
    
    # Check Supabase cache first
    if supabase.client:
        cached = supabase.get_analytics(wallet_address)
        if cached:
            return cached
    
    # Check if wallet.db exists
    db_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
        "vialytics-core",
        "wallet.db"
    )
    
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="Wallet not indexed yet. Please start indexing.")
    
    analyzer = WalletAnalyzer(db_path=db_path)
    return analyzer.analyze()

@app.get("/api/analytics/{wallet_address}")
async def get_analytics_by_wallet(wallet_address: str) -> Dict[str, Any]:
    """Get analytics for a specific wallet"""
    # TODO: Check Supabase cache first
    # For now, check if wallet.db exists for this wallet
    
    db_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
        "vialytics-core",
        f"{wallet_address}.db"
    )
    
    if not os.path.exists(db_path):
        # Try default wallet.db
        db_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
            "vialytics-core",
            "wallet.db"
        )
        
        if not os.path.exists(db_path):
            raise HTTPException(status_code=404, detail="Wallet not found. Please index first.")
    
    analyzer = WalletAnalyzer(db_path=db_path)
    return analyzer.analyze()

@app.get("/api/analytics")
async def get_analytics() -> Dict[str, Any]:
    """Get analytics for default wallet (legacy endpoint)"""
    db_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
        "vialytics-core",
        "wallet.db"
    )
    
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="No wallet data found")
    
    analyzer = WalletAnalyzer(db_path=db_path)
    return analyzer.analyze()

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
    uvicorn.run(app, host="0.0.0.0", port=8000)
