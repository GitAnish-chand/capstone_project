from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class QuizQuestionBase(BaseModel):
    question_text: str
    question_type: str = "multiple_choice"
    options: Optional[List[str]] = None
    correct_answer: str
    points: int = 1
    order: int = 0

class QuizQuestionCreate(QuizQuestionBase):
    pass

class QuizQuestionResponse(QuizQuestionBase):
    id: int
    quiz_id: int

    class Config:
        from_attributes = True

class QuizQuestionPublic(BaseModel):
    """Question without correct answer for students"""
    id: int
    question_text: str
    question_type: str
    options: Optional[List[str]] = None
    points: int
    order: int

    class Config:
        from_attributes = True

class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    passing_score: float = 70.0
    is_active: bool = True

class QuizCreate(QuizBase):
    course_id: int
    module_id: Optional[int] = None
    questions: List[QuizQuestionCreate] = []

class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    passing_score: Optional[float] = None
    is_active: Optional[bool] = None

class QuizResponse(QuizBase):
    id: int
    course_id: int
    module_id: Optional[int] = None
    created_at: datetime
    questions: List[QuizQuestionResponse] = []

    class Config:
        from_attributes = True

class QuizPublic(QuizBase):
    """Quiz without correct answers for students"""
    id: int
    course_id: int
    module_id: Optional[int] = None
    created_at: datetime
    questions: List[QuizQuestionPublic] = []

    class Config:
        from_attributes = True

class QuizAnswerSubmit(BaseModel):
    question_id: int
    answer: str

class QuizSubmission(BaseModel):
    answers: List[QuizAnswerSubmit]

class QuizResultResponse(BaseModel):
    id: int
    user_id: int
    quiz_id: int
    course_id: int
    score: float
    total_points: int
    earned_points: int
    passed: bool
    taken_at: datetime

    class Config:
        from_attributes = True
