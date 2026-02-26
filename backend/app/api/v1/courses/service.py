from sqlalchemy.orm import Session
from app.models.course import Course
from typing import List, Optional

def create_course(db: Session, title: str, description: str = None, category: str = None) -> Course:
    """Create a new course"""
    course = Course(
        title=title,
        description=description,
        category=category
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

def get_course(db: Session, course_id: int) -> Optional[Course]:
    """Get course by ID"""
    return db.query(Course).filter(Course.id == course_id).first()

def get_courses(db: Session, skip: int = 0, limit: int = 100, category: str = None, is_active: bool = None) -> List[Course]:
    """Get all courses with optional filters"""
    query = db.query(Course)
    
    if category:
        query = query.filter(Course.category == category)
    if is_active is not None:
        query = query.filter(Course.is_active == is_active)
    
    return query.offset(skip).limit(limit).all()

def update_course(db: Session, course_id: int, **kwargs) -> Optional[Course]:
    """Update course details"""
    course = get_course(db, course_id)
    if not course:
        return None
    
    for key, value in kwargs.items():
        if value is not None and hasattr(course, key):
            setattr(course, key, value)
    
    db.commit()
    db.refresh(course)
    return course

def delete_course(db: Session, course_id: int) -> bool:
    """Delete a course (soft delete by setting is_active to False)"""
    course = get_course(db, course_id)
    if not course:
        return False
    
    course.is_active = False
    db.commit()
    return True

def search_courses(db: Session, search_term: str) -> List[Course]:
    """Search courses by title or description"""
    return db.query(Course).filter(
        (Course.title.ilike(f"%{search_term}%")) | 
        (Course.description.ilike(f"%{search_term}%"))
    ).all()
