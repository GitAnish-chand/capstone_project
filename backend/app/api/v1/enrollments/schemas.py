from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EnrollmentCreate(BaseModel):
    course_id: int

class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    completed: bool
    enrolled_at: datetime
    progress_percent: Optional[float] = 0.0

    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    progress_percent: float
