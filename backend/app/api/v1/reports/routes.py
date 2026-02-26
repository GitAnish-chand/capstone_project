from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.auth import require_admin
from app.models.user import User
from app.api.v1.reports import schemas, service

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/user-progress", response_model=schemas.ReportResponse)
def generate_user_progress_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Generate user progress report (Admin only)"""
    return service.generate_user_progress_report(db, current_user.id)

@router.post("/course-engagement", response_model=schemas.ReportResponse)
def generate_course_engagement_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Generate course engagement report (Admin only)"""
    return service.generate_course_engagement_report(db, current_user.id)

@router.post("/performance", response_model=schemas.ReportResponse)
def generate_performance_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Generate overall performance report (Admin only)"""
    return service.generate_performance_report(db, current_user.id)

@router.get("/", response_model=List[schemas.ReportResponse])
def get_all_reports(
    report_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all reports, optionally filtered by type (Admin only)"""
    return service.get_reports(db, report_type)

@router.get("/{report_id}", response_model=schemas.ReportResponse)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get specific report (Admin only)"""
    report = service.get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
