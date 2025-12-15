import subprocess
import os
import json
from typing import Dict, Any
from vialytics_api.services.analytics import WalletAnalyzer
from vialytics_api.services.supabase_service import get_supabase

# Data directory for per-wallet databases
DATA_DIR = os.environ.get("VIALYTICS_DATA_DIR", "/tmp/vialytics_data")

class IndexerService:
    """Real vialytics-core indexer integration with per-wallet database support"""
    
    def __init__(self):
        # vialytics-api/src/vialytics_api/services/indexer_service.py
        # Navigate: services -> vialytics_api -> src -> vialytics-api -> vialytics (parent) -> vialytics-core
        current_dir = os.path.dirname(__file__)  # services/
        vialytics_api_src = os.path.dirname(os.path.dirname(current_dir))  # vialytics-api/src
        vialytics_api_root = os.path.dirname(vialytics_api_src)  # vialytics-api/
        project_root = os.path.dirname(vialytics_api_root)  # vialytics/
        self.core_path = os.path.join(project_root, "vialytics-core")
        
        self.supabase = get_supabase()
        
        # Ensure data directory exists
        os.makedirs(DATA_DIR, exist_ok=True)
    
    def get_wallet_db_path(self, wallet_address: str) -> str:
        """Get per-wallet database path"""
        return os.path.join(DATA_DIR, f"{wallet_address}.db")
    
    def run_indexer(self, wallet_address: str, job_id: str):
        """Run indexer in subprocess with per-wallet database"""
        try:
            # Update status
            if self.supabase.client:
                self.supabase.update_job(job_id, "running", 20)
            
            # Per-wallet database path
            db_path = self.get_wallet_db_path(wallet_address)
            
            # Check if binary exists
            binary_path = os.path.join(self.core_path, "target", "release", "vialytics-core")
            
            if not os.path.exists(self.core_path):
                raise Exception(f"vialytics-core not found at {self.core_path}")
            
            if os.path.exists(binary_path):
                cmd = [binary_path, "--wallet-address", wallet_address]
            else:
                # Fallback to cargo run
                cmd = ["cargo", "run", "--release", "--", "--wallet-address", wallet_address, "--config", "Vixen.toml"]
            
            # Set environment to use wallet-specific database
            env = os.environ.copy()
            env["VIALYTICS_DB_URL"] = f"sqlite:{db_path}"
            
            # Run indexer
            result = subprocess.run(
                cmd,
                cwd=self.core_path,
                capture_output=True,
                text=True,
                timeout=300,  # 5 min timeout
                env=env
            )
            
            if result.returncode != 0:
                raise Exception(f"Indexer failed: {result.stderr}")
            
            # Check if wallet.db was created
            if not os.path.exists(db_path):
                raise Exception(f"Database not created at {db_path}")
            
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

