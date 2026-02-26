from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.api.v1.chat import schemas, service

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/ask", response_model=schemas.ChatResponse)
def ask_question(
    chat_request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ask a question and get AI-powered response"""
    # Generate AI response
    answer = service.generate_ai_response(chat_request.question, chat_request.context)
    
    # Save chat history
    chat = service.save_chat(
        db,
        user_id=current_user.id,
        question=chat_request.question,
        answer=answer,
        course_id=chat_request.course_id,
        context=chat_request.context
    )
    
    return chat

@router.get("/history", response_model=List[schemas.ChatResponse])
def get_my_chat_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get my chat history"""
    return service.get_user_chat_history(db, current_user.id, limit)

@router.get("/history/course/{course_id}", response_model=List[schemas.ChatResponse])
def get_course_chat_history(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get chat history for a specific course"""
    return service.get_course_chat_history(db, current_user.id, course_id)
