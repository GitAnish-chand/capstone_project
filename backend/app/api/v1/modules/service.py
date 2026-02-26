from sqlalchemy.orm import Session
from app.models.module import Module
from typing import List, Optional

def create_module(db: Session, course_id: int, title: str, content: str = None, 
                 order: int = 0, duration_minutes: int = 0) -> Module:
    """Create a new module"""
    module = Module(
        course_id=course_id,
        title=title,
        content=content,
        order=order,
        duration_minutes=duration_minutes
    )
    db.add(module)
    db.commit()
    db.refresh(module)
    return module

def get_module(db: Session, module_id: int) -> Optional[Module]:
    """Get module by ID"""
    return db.query(Module).filter(Module.id == module_id).first()

def get_course_modules(db: Session, course_id: int) -> List[Module]:
    """Get all modules for a course, ordered by order field"""
    return db.query(Module).filter(
        Module.course_id == course_id
    ).order_by(Module.order).all()

def update_module(db: Session, module_id: int, **kwargs) -> Optional[Module]:
    """Update module details"""
    module = get_module(db, module_id)
    if not module:
        return None
    
    for key, value in kwargs.items():
        if value is not None and hasattr(module, key):
            setattr(module, key, value)
    
    db.commit()
    db.refresh(module)
    return module

def delete_module(db: Session, module_id: int) -> bool:
    """Delete a module"""
    module = get_module(db, module_id)
    if not module:
        return False
    
    db.delete(module)
    db.commit()
    return True
