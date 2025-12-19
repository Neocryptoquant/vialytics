import os
from typing import Optional, Dict, Any
import json
import uuid

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
                print("Supabase connected successfully")
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

    def create_job(self, wallet_address: str) -> str:
        """Create a new indexing job and return the job_id."""
        job_id = str(uuid.uuid4())
        if not self.client:
            return job_id
        
        try:
            self.client.table("indexing_jobs").insert({
                "id": job_id,
                "wallet_address": wallet_address,
                "status": "pending",
                "progress": 0
            }).execute()
            print(f"Created job {job_id} for wallet {wallet_address[:8]}...")
        except Exception as e:
            print(f"Supabase create_job error: {e}")
        
        return job_id
    
    def update_job(self, job_id: str, status: str, progress: int = 0, error_message: str = None) -> bool:
        """Update job status and progress."""
        if not self.client:
            return False
        
        try:
            data = {
                "status": status,
                "progress": progress,
                "updated_at": "now()"
            }
            if error_message:
                data["error_message"] = error_message
            
            self.client.table("indexing_jobs").update(data).eq("id", job_id).execute()
            return True
        except Exception as e:
            print(f"Supabase update_job error: {e}")
            return False
    
    def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get job status by ID."""
        if not self.client:
            return None
        
        try:
            result = self.client.table("indexing_jobs").select("*").eq("id", job_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Supabase get_job_status error: {e}")
            return None

_supabase_service = None

def get_supabase() -> SupabaseService:
    global _supabase_service
    if _supabase_service is None:
        _supabase_service = SupabaseService()
    return _supabase_service

