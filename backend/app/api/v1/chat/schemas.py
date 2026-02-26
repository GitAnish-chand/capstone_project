from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ChatRequest(BaseModel):
    question: str
    course_id: Optional[int] = None
    context: str = "general"

class ChatResponse(BaseModel):
    id: int
    question: str
    answer: str
    context: str
    created_at: datetime

    class Config:
        from_attributes = True
