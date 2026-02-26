from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user, require_admin
from app.models.user import User
from app.api.v1.quizzes import schemas, service
from app.models.quiz import QuizResult


router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

# Admin routes
@router.post("/", response_model=schemas.QuizResponse)
def create_quiz(
    quiz: schemas.QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new quiz with questions (Admin only)"""
    new_quiz = service.create_quiz(
        db,
        course_id=quiz.course_id,
        title=quiz.title,
        description=quiz.description,
        passing_score=quiz.passing_score,
        module_id=quiz.module_id
    )
    
    # Add questions
    for question_data in quiz.questions:
        service.add_question_to_quiz(
            db,
            quiz_id=new_quiz.id,
            question_text=question_data.question_text,
            correct_answer=question_data.correct_answer,
            question_type=question_data.question_type,
            options=question_data.options,
            points=question_data.points,
            order=question_data.order
        )
    
    # Refresh to get questions
    db.refresh(new_quiz)
    return new_quiz

@router.put("/{quiz_id}", response_model=schemas.QuizResponse)
def update_quiz(
    quiz_id: int,
    quiz_update: schemas.QuizUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update a quiz (Admin only)"""
    updated_quiz = service.update_quiz(
        db,
        quiz_id,
        **quiz_update.dict(exclude_unset=True)
    )
    if not updated_quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return updated_quiz

@router.delete("/{quiz_id}")
def delete_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete a quiz (Admin only)"""
    success = service.delete_quiz(db, quiz_id)
    if not success:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return {"message": "Quiz deleted successfully"}

@router.delete("/{quiz_id}/reset")
def reset_quiz_attempt(
    quiz_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Delete previous results to allow a fresh start"""
    # Delete the record from QuizResult table
    db.query(QuizResult).filter(
        QuizResult.user_id == current_user.id,
        QuizResult.quiz_id == quiz_id
    ).delete()
    
    db.commit()
    return {"message": "Quiz reset successfully. You can now reattempt."}

# Employee routes
@router.get("/course/{course_id}", response_model=List[schemas.QuizPublic])
def get_course_quizzes(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all quizzes for a course (without answers)"""
    return service.get_course_quizzes(db, course_id)

# @router.get("/{quiz_id}", response_model=schemas.QuizPublic)
# def get_quiz(
#     quiz_id: int,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Get quiz details (without answers)"""
#     quiz = service.get_quiz(db, quiz_id)
#     if not quiz:
#         raise HTTPException(status_code=404, detail="Quiz not found")
#     return quiz

# @router.get("/{quiz_id}")
# def get_quiz(
#     quiz_id: int,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
#     ):
#     # Check last attempt
#     last_result = db.query(QuizResult).filter(
#         QuizResult.user_id == current_user.id,
#         QuizResult.quiz_id == quiz_id
#     ).order_by(QuizResult.taken_at.desc()).first()

#     if last_result:
#         return {
#             "status": "completed",
#             "score": last_result.score,
#             "passed": last_result.passed,
#             "can_reattempt": not last_result.passed,
#             "result": last_result
#         }

#     # If never attempted
#     quiz = service.get_quiz(db, quiz_id)
#     if not quiz:
#         raise HTTPException(status_code=404, detail="Quiz not found")

#     return {
#         "status": "pending",
#         "quiz": quiz
#     }

@router.get("/{quiz_id}")
def get_quiz(
    quiz_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Check for previous attempts first
    last_result = db.query(QuizResult).filter(
        QuizResult.user_id == current_user.id,
        QuizResult.quiz_id == quiz_id
    ).order_by(QuizResult.taken_at.desc()).first()

    if last_result:
        return {
            "status": "completed",
            "result": last_result
        }

    # Use the service that includes 'joinedload'
    quiz = service.get_quiz(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return {
        "status": "pending",
        "quiz": quiz
    }

# @router.post("/{quiz_id}/submit", response_model=schemas.QuizResultResponse)
# def submit_quiz(
#     quiz_id: int,
#     submission: schemas.QuizSubmission,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Submit quiz answers"""
#     # Convert answers list to dict
#     answers_dict = {ans.question_id: ans.answer for ans in submission.answers}
    
#     try:
#         result = service.submit_quiz(db, current_user.id, quiz_id, answers_dict)
#         return result
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))

@router.post("/{quiz_id}/submit", response_model=schemas.QuizResultResponse)
def submit_quiz(
    quiz_id: int,
    submission: schemas.QuizSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit quiz answers"""
    try:
        # Pass the list directly: submission.answers
        result = service.submit_quiz(db, current_user.id, quiz_id, submission.answers)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/results/my-results", response_model=List[schemas.QuizResultResponse])
def get_my_quiz_results(
    course_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get my quiz results"""
    return service.get_user_quiz_results(db, current_user.id, course_id)

