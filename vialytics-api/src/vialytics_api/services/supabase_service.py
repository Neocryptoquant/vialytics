import os
from typing import Optional, Dict, Any
import json

class SupabaseService:
    """Supabase service for caching - install with: pip install supabase"""
    
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        self.client = None
        
        try:
            from supabase import create_client
            if self.url and self.key:
                self.client = create_client(self.url, self.key)
        except ImportError:
            print("Supabase not installed. Run: pip install supabase")
    
    def get_analytics(self, wallet_address: str) -> Optional[Dict[str, Any]]:
        if not self.client:
            return None
        
        try:
            result = self.client.table("wallet_analytics").select("*").eq("wallet_address", wallet_address).execute()
            return result.data[0]["analytics_json"] if result.data else None
        except Exception as e:
            print(f"Supabase error: {e}")
            return None
    
    def save_analytics(self, wallet_address: str, analytics_data: Dict[str, Any]) -> bool:
        if not self.client:
            return False
        
        try:
            self.client.table("wallet_analytics").upsert({
                "wallet_address": wallet_address,
                "analytics_json": analytics_data
            }).execute()
            return True
        except Exception as e:
            print(f"Supabase save error: {e}")
            return False

_supabase_service = None

def get_supabase() -> SupabaseService:
    global _supabase_service
    if _supabase_service is None:
        _supabase_service = SupabaseService()
    return _supabase_service
