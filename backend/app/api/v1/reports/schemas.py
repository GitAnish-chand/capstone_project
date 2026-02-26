from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class ReportResponse(BaseModel):
    id: int
    generated_by: int
    report_type: str
    title: str
    data: Dict[str, Any]
    generated_at: datetime

    class Config:
        from_attributes = True

class UserProgressData(BaseModel):
    user_id: int
    user_name: str
    enrolled_courses: int
    completed_courses: int
    average_score: float
    total_quizzes_taken: int

class CourseEngagementData(BaseModel):
    course_id: int
    course_title: str
    total_enrollments: int
    completion_rate: float
    average_score: float
