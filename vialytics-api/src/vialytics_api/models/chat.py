from pydantic import BaseModel
from typing import List, Optional, Any

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class VisualizationHint(BaseModel):
    type: str # "arc", "sankey", "heatmap", "list"
    data: Any
    title: str

class ChatResponse(BaseModel):
    text: str
    visualization: Optional[VisualizationHint] = None
