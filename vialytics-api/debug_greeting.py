import asyncio
import os
from vialytics_api.services.llm_service import LLMService

# Set env var explicitly
os.environ["GEMINI_API_KEY"] = "AIzaSyCWUny6z6gzPU4x8wWsglTplwaq5F1COzY"

async def main():
    print("--- Starting Greeting Debug ---")
    llm = LLMService()
    
    query = "hi"
    print(f"Query: {query}")
    
    try:
        intent = await llm.analyze_query(query)
        print(f"Intent Action: {intent.action}")
        print(f"Text Response: {intent.text_response}")
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")

    print("--- End Debug ---")

if __name__ == "__main__":
    asyncio.run(main())
