import sqlite3
import os
from typing import Optional

DEFAULT_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), "vialytics-core", "wallet.db")

class Database:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or DEFAULT_DB_PATH
        if not os.path.exists(self.db_path):
             # Fallback for dev environment if needed, or just warn
             print(f"Warning: Database not found at {self.db_path}")

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

# Singleton/Helper
def get_db_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    return Database(db_path).get_connection()
