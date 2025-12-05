from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from vialytics_api.routers import chat, analytics

app = FastAPI(
    title="Vialytics API",
    description="Backend API for Vialytics - Conversational Analytics for Solana Wallets",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

@app.get("/")
async def root():
    return {"message": "Welcome to Vialytics API"}
