from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.api.v1.enrollments import schemas, service

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])

@router.post("/", response_model=schemas.EnrollmentResponse)
def enroll_in_course(
    enrollment: schemas.EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Enroll in a course"""
    try:
        result = service.enroll_user(db, current_user.id, enrollment.course_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.EnrollmentResponse])
def get_my_enrollments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all my enrollments"""
    print("GET Current User ID:", current_user.id)
    return service.get_user_enrollments(db, current_user.id)

@router.delete("/{course_id}")
def unenroll_from_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Unenroll from a course"""
    success = service.unenroll_user(db, current_user.id, course_id)
    if not success:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"message": "Unenrolled successfully"}

@router.put("/{course_id}/progress")
def update_course_progress(
    course_id: int,
    progress_data: schemas.ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update progress for a course"""
    try:
        progress = service.update_progress(
            db,
            current_user.id,
            course_id,
            progress_data.progress_percent
        )
        return {"message": "Progress updated", "progress_percent": progress.progress_percent}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{course_id}/progress")
def get_course_progress(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get my progress for a specific course"""
    progress = service.get_user_progress(db, current_user.id, course_id)
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    return progress
