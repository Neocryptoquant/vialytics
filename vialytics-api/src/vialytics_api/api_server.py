from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os

from vialytics_api.services.analytics import WalletAnalyzer

app = FastAPI(title="Vialytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
    "vialytics-core",
    "wallet.db"
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    response: str

@app.get("/api/analytics")
async def get_analytics() -> Dict[str, Any]:
    analyzer = WalletAnalyzer(db_path=DB_PATH)
    return analyzer.analyze()

@app.post("/api/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    # For now, return a simple echo/mock response
    # In production, this would call the LLM
    user_message = request.messages[-1].content if request.messages else ""
    
    # Simple pattern matching for demo
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
