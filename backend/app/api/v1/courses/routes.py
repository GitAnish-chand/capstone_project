from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.auth import get_current_user, require_admin
from app.models.user import User
from app.api.v1.courses import schemas, service

router = APIRouter(prefix="/courses", tags=["Courses"])

# Admin routes - Create, Update, Delete
@router.post("/", response_model=schemas.CourseResponse)
def create_course(
    course: schemas.CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new course (Admin only)"""
    return service.create_course(
        db,
        title=course.title,
        description=course.description,
        category=course.category
    )

@router.put("/{course_id}", response_model=schemas.CourseResponse)
def update_course(
    course_id: int,
    course_update: schemas.CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update a course (Admin only)"""
    updated_course = service.update_course(
        db,
        course_id,
        **course_update.dict(exclude_unset=True)
    )
    if not updated_course:
        raise HTTPException(status_code=404, detail="Course not found")
    return updated_course

@router.delete("/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete a course (Admin only)"""
    success = service.delete_course(db, course_id)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted successfully"}

# Public/Employee routes - View courses
@router.get("/", response_model=List[schemas.CourseResponse])
def list_courses(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all active courses"""
    return service.get_courses(db, skip=skip, limit=limit, category=category, is_active=True)

@router.get("/search")
def search_courses(
    q: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search courses by title or description"""
    return service.search_courses(db, q)

@router.get("/{course_id}", response_model=schemas.CourseResponse)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get course details"""
    course = service.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
