from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ModuleBase(BaseModel):
    title: str
    content: Optional[str] = None
    order: int = 0
    duration_minutes: int = 0

class ModuleCreate(ModuleBase):
    course_id: int

class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    order: Optional[int] = None
    duration_minutes: Optional[int] = None

class ModuleResponse(ModuleBase):
    id: int
    course_id: int
    created_at: datetime

    class Config:
        from_attributes = True
