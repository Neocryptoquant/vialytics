from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from vialytics_api.models.chat import ChatRequest, ChatResponse, VisualizationHint
from vialytics_api.services.llm_service import LLMService
from vialytics_api.services.data_service import DataService
from vialytics_api.core.database import get_db

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    llm_service = LLMService()
    data_service = DataService(db)

    # 1. Analyze Intent
    intent = await llm_service.analyze_query(request.message)
    
    response_text = intent.text_response
    visualization = None

    # 2. Execute Data Query if needed
    if intent.action == "query_data" and intent.sql_query:
        df = data_service.execute_query(intent.sql_query)
        
        if not df.empty:
            # Handle scalar results
            if len(df) == 1 and len(df.columns) == 1:
                val = df.iloc[0, 0]
                data_summary = f"The result is {val}."
                visualization = None
            else:
                # Transform data for UI
                formatted_data = []
                for _, row in df.iterrows():
                    # Check if this is a standard transaction row
                    if 'signature' in row and 'block_time' in row:
                        # ... (Existing Transaction Logic) ...
                        tx_type = "send" 
                        
                        # Format Time
                        try:
                            ts = int(row.get('block_time', 0))
                            if ts > 0:
                                import datetime
                                dt = datetime.datetime.fromtimestamp(ts)
                                now = datetime.datetime.now()
                                diff = now - dt
                                if diff.days > 0:
                                    time_str = f"{diff.days} days ago"
                                elif diff.seconds > 3600:
                                    time_str = f"{diff.seconds // 3600} hours ago"
                                elif diff.seconds > 60:
                                    time_str = f"{diff.seconds // 60} minutes ago"
                                else:
                                    time_str = "Just now"
                            else:
                                time_str = "Unknown time"
                        except:
                            time_str = str(row.get('block_time', 'Unknown'))

                        # Format Description
                        amount = row.get('amount')
                        mint = row.get('mint')
                        
                        if amount is not None:
                            symbol = "TOKENS"
                            if mint == "So11111111111111111111111111111111111111112":
                                symbol = "SOL"
                            elif mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v":
                                symbol = "USDC"
                            elif mint == "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB":
                                symbol = "USDT"
                            description = f"Transferred {amount} {symbol}"
                        else:
                            description = f"Transaction {row.get('signature', 'Unknown')[:8]}..."
                        
                        icon = "https://cryptologos.cc/logos/solana-sol-logo.png?v=029"

                    else:
                        # Generic Data Handling (for aggregations, etc.)
                        # Create a description from all columns
                        parts = []
                        for col in df.columns:
                            val = row[col]
                            if val is not None:
                                parts.append(f"{col}: {val}")
                        description = ", ".join(parts)
                        time_str = ""
                        icon = "https://cdn-icons-png.flaticon.com/512/1006/1006771.png" # Generic info icon

                    formatted_data.append({
                        "id": row.get('signature', str(_)),
                        "type": "info",
                        "description": description,
                        "time": time_str,
                        "status": "success",
                        "icon": icon
                    })

                visualization = VisualizationHint(
                    type=intent.visualization_type,
                    data=formatted_data,
                    title="Query Results"
                )
                # Create a richer summary for the LLM
                top_items = formatted_data[:5]
                items_desc = "; ".join([f"{item['description']} ({item['time']})" for item in top_items])
                data_summary = f"Found {len(formatted_data)} records. Top items: {items_desc}."

            # 3. Generate Witty Response based on Data
            response_text = await llm_service.generate_response_from_data(request.message, data_summary)
            
        else:
            response_text = await llm_service.generate_response_from_data(request.message, "No data found.")
    
    return ChatResponse(
        text=response_text,
        visualization=visualization
    )
