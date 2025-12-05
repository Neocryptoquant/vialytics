import asyncio
import os
from vialytics_api.services.llm_service import LLMService
from vialytics_api.services.data_service import DataService
from vialytics_api.core.database import SessionLocal

# Set env var explicitly for the script
os.environ["GEMINI_API_KEY"] = "AIzaSyCWUny6z6gzPU4x8wWsglTplwaq5F1COzY"

async def main():
    print("--- Starting Debug ---")
    
    # 1. Init Services
    llm = LLMService()
    db = SessionLocal()
    data_service = DataService(db)
    
    query = "Who do I trade with most?"
    print(f"Query: {query}")
    
    # 2. Analyze
    intent = await llm.analyze_query(query)
    print(f"Intent Action: {intent.action}")
    print(f"Generated SQL: {intent.sql_query}")
    
    # 3. Execute
    if intent.action == "query_data" and intent.sql_query:
        try:
            df = data_service.execute_query(intent.sql_query)
            print(f"Rows found: {len(df)}")
            if not df.empty:
                print("First 5 rows:")
                print(df.head())
            else:
                print("DataFrame is empty.")
        except Exception as e:
            print(f"Execution Error: {e}")
    else:
        print("No SQL to execute.")

    print("--- End Debug ---")

if __name__ == "__main__":
    asyncio.run(main())
