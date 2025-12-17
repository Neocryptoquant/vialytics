"""
Indexer service - runs vialytics-core for wallet transaction indexing.
Based on the working wrapped-worker implementation.
"""
import subprocess
import os
import threading
from typing import Dict, Any, Optional
from vialytics_api.services.analytics import WalletAnalyzer
from vialytics_api.services.supabase_service import get_supabase

# Data directory for per-wallet databases and configs
DATA_DIR = os.environ.get("VIALYTICS_DATA_DIR", "/tmp/vialytics_data")
RPC_URL = os.environ.get("RPC_URL", "https://mainnet.helius-rpc.com/?api-key=532c57d3-d97d-445a-971c-7c017aafa285")

class IndexerService:
    """Real vialytics-core indexer integration with per-wallet database support."""
    
    def __init__(self):
        # Path resolution: services -> vialytics_api -> src -> vialytics-api -> vialytics -> vialytics-core
        current_dir = os.path.dirname(__file__)
        vialytics_api_src = os.path.dirname(os.path.dirname(current_dir))
        vialytics_api_root = os.path.dirname(vialytics_api_src)
        project_root = os.path.dirname(vialytics_api_root)
        self.core_path = os.path.join(project_root, "vialytics-core")
        self.binary_path = os.path.join(self.core_path, "target", "release", "vialytics-core")
        
        self.supabase = get_supabase()
        os.makedirs(DATA_DIR, exist_ok=True)
    
    def get_wallet_db_path(self, wallet_address: str) -> str:
        """Get per-wallet database path."""
        return os.path.join(DATA_DIR, f"wallet_{wallet_address}.db")
    
    def get_wallet_config_path(self, wallet_address: str) -> str:
        """Get per-wallet config file path."""
        return os.path.join(DATA_DIR, f"config_{wallet_address}.toml")
    
    def create_config(self, wallet_address: str) -> str:
        """Create per-wallet config file (like wrapped-worker)."""
        db_path = self.get_wallet_db_path(wallet_address)
        config_path = self.get_wallet_config_path(wallet_address)
        
        config_content = f"""[source]
endpoint = "{RPC_URL}"
x-token = "mock-token"
timeout = 10

[vialytics]
rpc_url = "{RPC_URL}"
db_url = "sqlite://{db_path}"

[pipeline]
"""
        with open(config_path, 'w') as f:
            f.write(config_content)
        
        return config_path
    
    def run_indexer(self, wallet_address: str, job_id: str) -> Dict[str, Any]:
        """Run indexer with per-wallet config, watching for completion message."""
        try:
            if self.supabase.client:
                self.supabase.update_job(job_id, "running", 10)
            
            # Check binary exists
            if not os.path.exists(self.binary_path):
                # Try cargo build first
                if os.path.exists(self.core_path):
                    print(f"[{job_id}] Binary not found, attempting cargo build...")
                    build_result = subprocess.run(
                        ["cargo", "build", "--release"],
                        cwd=self.core_path,
                        capture_output=True,
                        text=True,
                        timeout=600
                    )
                    if build_result.returncode != 0:
                        raise Exception(f"Cargo build failed: {build_result.stderr}")
                else:
                    raise Exception(f"vialytics-core not found at {self.core_path}")
            
            # Create per-wallet config
            config_path = self.create_config(wallet_address)
            db_path = self.get_wallet_db_path(wallet_address)
            
            print(f"[{job_id}] Starting indexer for {wallet_address}...")
            
            if self.supabase.client:
                self.supabase.update_job(job_id, "running", 20)
            
            # Run indexer with process streaming (like wrapped-worker)
            cmd = [self.binary_path, "--config", config_path, "--wallet-address", wallet_address]
            env = os.environ.copy()
            env["RUST_LOG"] = "info"
            
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                env=env
            )
            
            # Monitor output for completion message
            completed = False
            timeout_seconds = 300  # 5 minutes
            
            def read_output():
                nonlocal completed
                buffer = ""
                for line in iter(process.stdout.readline, ''):
                    if not line:
                        break
                    buffer += line
                    print(f"[Indexer]: {line.strip()}")
                    
                    # Check for completion (same as wrapped-worker)
                    if "Finished fetching history" in buffer:
                        print(f"[{job_id}] History fetch complete. Stopping indexer.")
                        completed = True
                        process.terminate() # Graceful shutdown for WAL flush
                        try:
                            process.wait(timeout=5)
                        except subprocess.TimeoutExpired:
                            process.kill()
                        break
            
            output_thread = threading.Thread(target=read_output)
            output_thread.start()
            output_thread.join(timeout=timeout_seconds)
            
            if output_thread.is_alive():
                process.kill()
                raise Exception("Indexer timed out")
            
            # Check if DB was created
            if not os.path.exists(db_path):
                stderr = process.stderr.read() if process.stderr else ""
                raise Exception(f"Database not created. Stderr: {stderr}")
            
            if self.supabase.client:
                self.supabase.update_job(job_id, "running", 80)
            
            print(f"[{job_id}] Analyzing data from {db_path}...")
            
            # Analyze data
            analyzer = WalletAnalyzer(db_path=db_path)
            analytics = analyzer.analyze()
            
            # Save to Supabase
            if self.supabase.client:
                self.supabase.save_analytics(wallet_address, analytics)
                self.supabase.update_job(job_id, "completed", 100)
            
            print(f"[{job_id}] Request completed successfully.")
            
            # Cleanup config file (keep DB for caching)
            try:
                os.remove(config_path)
            except:
                pass
            
            return analytics
            
        except Exception as e:
            error_msg = str(e)
            print(f"[{job_id}] Indexer error: {error_msg}")
            if self.supabase.client:
                self.supabase.update_job(job_id, "failed", 0, error_msg)
            raise


_indexer_service: Optional[IndexerService] = None

def get_indexer() -> IndexerService:
    global _indexer_service
    if _indexer_service is None:
        _indexer_service = IndexerService()
    return _indexer_service
