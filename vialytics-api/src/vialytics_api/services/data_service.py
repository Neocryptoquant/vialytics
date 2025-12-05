import pandas as pd
from sqlalchemy import text
from sqlalchemy.orm import Session

class DataService:
    def __init__(self, db: Session):
        self.db = db

    def execute_query(self, query: str, params: dict = None) -> pd.DataFrame:
        """
        Executes a raw SQL query and returns the result as a Pandas DataFrame.
        """
        try:
            result = self.db.execute(text(query), params or {})
            df = pd.DataFrame(result.fetchall(), columns=result.keys())
            return df
        except Exception as e:
            print(f"Error executing query: {e}")
            return pd.DataFrame()

    def get_recent_transactions(self, limit: int = 5) -> pd.DataFrame:
        query = """
        SELECT * FROM transactions 
        ORDER BY block_time DESC 
        LIMIT :limit
        """
        return self.execute_query(query, {"limit": limit})
