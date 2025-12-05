from google import genai
from pydantic import BaseModel, Field
from vialytics_api.core.config import settings
import json
import random

class Intent(BaseModel):
    action: str = Field(description="The action to perform: 'query_data', 'explain', 'greeting'")
    sql_query: str | None = Field(default="", description="The SQL query to execute if action is 'query_data'")
    visualization_type: str | None = Field(default="text", description="The recommended visualization")
    text_response: str = Field(description="A concise text response if no data query is needed")

class LLMService:
    def __init__(self):
        # Initialize Gemini Client
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = "gemini-2.0-flash"
        
        # Personas for dynamic interaction
        self.personas = [
            "You are a cynical blockchain detective.",
            "You are an enthusiastic crypto analyst.",
            "You are a precise and logical data scientist.",
            "You are a helpful and friendly assistant."
        ]

        # Schema definition for the AI
        self.schema_context = """
Table: transactions
- signature (TEXT, Primary Key): Transaction hash.
- block_time (INTEGER): Unix timestamp.
- status (TEXT): 'Success' or 'Failed'.
- fee (INTEGER): Fee in lamports.

Table: token_movements
- signature (TEXT, Foreign Key): Links to transactions.
- mint (TEXT): Token mint address.
- amount (REAL): Amount moved.
- decimals (INTEGER): Decimals.
- source (TEXT): Sender.
- destination (TEXT): Receiver.
"""

    async def analyze_query(self, query: str) -> Intent:
        """
        Step 1: Analyze user intent and generate SQL if needed.
        """
        try:
            if not settings.GEMINI_API_KEY:
                return Intent(action="error", sql_query="", visualization_type="text", text_response="API Key missing.")

            system_prompt = f"""
You are an expert Solana data analyst.
{self.schema_context}

GOAL:
1. Analyze the user's request.
2. If they need data from their wallet, generate a valid SQL query.
   - IMPORTANT: The database contains ONLY the user's data. Do NOT filter by `source` or `destination` address unless specifically asked.
   - Assume all transactions in `transactions` and `token_movements` belong to the user.
3. If they want to chat about anything else (weather, crypto trends, life), just chat! Set action to 'greeting' or 'explain' and provide a helpful response.
   - DO NOT say you can only talk about Solana. Be a helpful, witty assistant.

OUTPUT JSON:
{{
  "action": "query_data" | "explain" | "greeting",
  "sql_query": "SELECT ...",
  "visualization_type": "arc" | "sankey" | "heatmap" | "list" | "text",
  "text_response": "..."
}}
"""
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=query,
                config={
                    "system_instruction": system_prompt,
                    "response_mime_type": "application/json"
                }
            )
            
            data = json.loads(response.text)
            return Intent(**data)
            
        except Exception as e:
            print(f"Gemini Analyze Error: {e}")
            return Intent(action="error", sql_query="", visualization_type="text", text_response="I encountered an error analyzing your request.")

    async def generate_response_from_data(self, query: str, data_summary: str) -> str:
        """
        Step 2: Generate a natural language response based on the query results.
        """
        try:
            persona = random.choice(self.personas)
            prompt = f"""
{persona}

User Question: "{query}"
Data Found: {data_summary}

Task: Answer the user's question using the data found.
- Be concise and witty.
- Cite specific numbers/tokens from the data.
- If data is empty, explain why or make a lighthearted comment.
"""
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            return response.text
        except Exception as e:
            print(f"Gemini Generate Error: {e}")
            return f"Here is the data I found. (Error generating summary: {e})"
