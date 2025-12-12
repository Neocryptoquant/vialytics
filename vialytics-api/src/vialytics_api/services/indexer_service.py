import subprocess
import os
import json
from typing import Dict, Any
from vialytics_api.services.analytics import WalletAnalyzer
from vialytics_api.services.supabase_service import get_supabase

class IndexerService:
    """Real vialytics-core indexer integration"""
    
    def __init__(self):
        self.core_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
            "vialytics-core"
        )
        self.supabase = get_supabase()
    
    def run_indexer(self, wallet_address: str, job_id: str):
        """Run indexer in subprocess"""
        try:
            # Update status
            if self.supabase.client:
                self.supabase.update_job(job_id, "running", 20)
            
            # Check if binary exists
            binary_path = os.path.join(self.core_path, "target", "release", "vialytics-core")
            
            if os.path.exists(binary_path):
                cmd = [binary_path, wallet_address]
            else:
                # Fallback to cargo run
                cmd = ["cargo", "run", "--release", "--", wallet_address]
            
            # Run indexer
            result = subprocess.run(
                cmd,
                cwd=self.core_path,
                capture_output=True,
                text=True,
                timeout=300  # 5 min timeout
            )
            
            if result.returncode != 0:
                raise Exception(f"Indexer failed: {result.stderr}")
            
            # Check if wallet.db was created
            db_path = os.path.join(self.core_path, "wallet.db")
            if not os.path.exists(db_path):
                raise Exception("wallet.db not created")
            
            # Generate analytics
            if self.supabase.client:
                self.supabase.update_job(job_id, "running", 80)
            
            analyzer = WalletAnalyzer(db_path=db_path)
            analytics = analyzer.analyze()
            
            # Save to Supabase
            if self.supabase.client:
                self.supabase.save_analytics(wallet_address, analytics)
                self.supabase.update_job(job_id, "completed", 100)
            
            return analytics
            
        except Exception as e:
            error_msg = str(e)
            print(f"Indexer error: {error_msg}")
            if self.supabase.client:
                self.supabase.update_job(job_id, "failed", 0, error_msg)
            raise

_indexer_service = None

def get_indexer() -> IndexerService:
    global _indexer_service
    if _indexer_service is None:
        _indexer_service = IndexerService()
    return _indexer_service
