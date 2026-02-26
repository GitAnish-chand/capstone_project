from sqlalchemy.orm import Session
from app.models.enrollment import Enrollment
from app.models.progress import Progress
from app.models.course import Course
from typing import List, Optional

def enroll_user(db: Session, user_id: int, course_id: int) -> Enrollment:
    """Enroll a user in a course"""
    # Check if already enrolled
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.course_id == course_id
    ).first()
    
    if existing:
        raise ValueError("Already enrolled in this course")
    
    # Check if course exists
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise ValueError("Course not found")
    
    enrollment = Enrollment(user_id=user_id, course_id=course_id)
    db.add(enrollment)
    
    # Create initial progress record
    progress = Progress(user_id=user_id, course_id=course_id, progress_percent=0.0)
    db.add(progress)
    
    db.commit()
    db.refresh(enrollment)
    return enrollment

def get_user_enrollments(db: Session, user_id: int) -> List[Enrollment]:
    """Get all enrollments for a user"""
    return db.query(Enrollment).filter(Enrollment.user_id == user_id).all()

def get_enrollment(db: Session, enrollment_id: int, user_id: int) -> Optional[Enrollment]:
    """Get specific enrollment"""
    return db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.user_id == user_id
    ).first()

def update_progress(db: Session, user_id: int, course_id: int, progress_percent: float) -> Progress:
    """Update course progress"""
    progress = db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.course_id == course_id
    ).first()
    
    if not progress:
        raise ValueError("Progress record not found")
    
    progress.progress_percent = min(100.0, max(0.0, progress_percent))
    
    # Mark enrollment as complete if progress is 100%
    if progress.progress_percent >= 100.0:
        enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == user_id,
            Enrollment.course_id == course_id
        ).first()
        if enrollment:
            enrollment.completed = True
    
    db.commit()
    db.refresh(progress)
    return progress

def get_user_progress(db: Session, user_id: int, course_id: int) -> Optional[Progress]:
    """Get user's progress for a specific course"""
    return db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.course_id == course_id
    ).first()

def unenroll_user(db: Session, user_id: int, course_id: int) -> bool:
    """Unenroll a user from a course"""
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == user_id,
        Enrollment.course_id == course_id
    ).first()
    
    if not enrollment:
        return False
    
    # Delete progress record
    db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.course_id == course_id
    ).delete()
    
    db.delete(enrollment)
    db.commit()
    return True
