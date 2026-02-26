from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user, require_admin
from app.models.user import User
from app.api.v1.modules import schemas, service

router = APIRouter(prefix="/modules", tags=["Modules"])

# Admin routes
@router.post("/", response_model=schemas.ModuleResponse)
def create_module(
    module: schemas.ModuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new module (Admin only)"""
    return service.create_module(
        db,
        course_id=module.course_id,
        title=module.title,
        content=module.content,
        order=module.order,
        duration_minutes=module.duration_minutes
    )

@router.put("/{module_id}", response_model=schemas.ModuleResponse)
def update_module(
    module_id: int,
    module_update: schemas.ModuleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update a module (Admin only)"""
    updated_module = service.update_module(
        db,
        module_id,
        **module_update.dict(exclude_unset=True)
    )
    if not updated_module:
        raise HTTPException(status_code=404, detail="Module not found")
    return updated_module

@router.delete("/{module_id}")
def delete_module(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete a module (Admin only)"""
    success = service.delete_module(db, module_id)
    if not success:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"message": "Module deleted successfully"}

# Employee/Public routes
@router.get("/course/{course_id}", response_model=List[schemas.ModuleResponse])
def get_course_modules(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all modules for a course"""
    return service.get_course_modules(db, course_id)

@router.get("/{module_id}", response_model=schemas.ModuleResponse)
def get_module(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get module details"""
    module = service.get_module(db, module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module
