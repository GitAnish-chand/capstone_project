from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.report import Report
from app.models.enrollment import Enrollment
from app.models.quiz import QuizResult
from app.models.user import User
from app.models.course import Course
from typing import List, Dict, Any

def generate_user_progress_report(db: Session, admin_id: int) -> Report:
    """Generate report showing all users' progress"""
    users = db.query(User).filter(User.role == "employee").all()
    
    user_data = []
    for user in users:
        enrollments = db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
        completed = sum(1 for e in enrollments if e.completed)
        
        quiz_results = db.query(QuizResult).filter(QuizResult.user_id == user.id).all()
        avg_score = sum(r.score for r in quiz_results) / len(quiz_results) if quiz_results else 0
        
        user_data.append({
            "user_id": user.id,
            "user_name": user.full_name,
            "email": user.email,
            "enrolled_courses": len(enrollments),
            "completed_courses": completed,
            "average_score": round(avg_score, 2),
            "total_quizzes_taken": len(quiz_results)
        })
    
    report = Report(
        generated_by=admin_id,
        report_type="user_progress",
        title="User Progress Report",
        data={"users": user_data, "total_users": len(users)}
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def generate_course_engagement_report(db: Session, admin_id: int) -> Report:
    """Generate report showing course engagement metrics"""
    courses = db.query(Course).filter(Course.is_active == True).all()
    
    course_data = []
    for course in courses:
        enrollments = db.query(Enrollment).filter(Enrollment.course_id == course.id).all()
        completed = sum(1 for e in enrollments if e.completed)
        completion_rate = (completed / len(enrollments) * 100) if enrollments else 0
        
        quiz_results = db.query(QuizResult).filter(QuizResult.course_id == course.id).all()
        avg_score = sum(r.score for r in quiz_results) / len(quiz_results) if quiz_results else 0
        
        course_data.append({
            "course_id": course.id,
            "course_title": course.title,
            "category": course.category,
            "total_enrollments": len(enrollments),
            "completed_enrollments": completed,
            "completion_rate": round(completion_rate, 2),
            "average_score": round(avg_score, 2),
            "total_quizzes_taken": len(quiz_results)
        })
    
    report = Report(
        generated_by=admin_id,
        report_type="course_engagement",
        title="Course Engagement Report",
        data={"courses": course_data, "total_courses": len(courses)}
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def generate_performance_report(db: Session, admin_id: int) -> Report:
    """Generate overall performance report"""
    total_users = db.query(User).filter(User.role == "employee").count()
    total_courses = db.query(Course).filter(Course.is_active == True).count()
    total_enrollments = db.query(Enrollment).count()
    completed_enrollments = db.query(Enrollment).filter(Enrollment.completed == True).count()
    
    quiz_results = db.query(QuizResult).all()
    overall_avg_score = sum(r.score for r in quiz_results) / len(quiz_results) if quiz_results else 0
    passed_quizzes = sum(1 for r in quiz_results if r.passed)
    
    data = {
        "total_employees": total_users,
        "total_active_courses": total_courses,
        "total_enrollments": total_enrollments,
        "completed_enrollments": completed_enrollments,
        "overall_completion_rate": round((completed_enrollments / total_enrollments * 100) if total_enrollments else 0, 2),
        "total_quizzes_taken": len(quiz_results),
        "passed_quizzes": passed_quizzes,
        "quiz_pass_rate": round((passed_quizzes / len(quiz_results) * 100) if quiz_results else 0, 2),
        "overall_average_score": round(overall_avg_score, 2)
    }
    
    report = Report(
        generated_by=admin_id,
        report_type="performance",
        title="Overall Performance Report",
        data=data
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def get_reports(db: Session, report_type: str = None) -> List[Report]:
    """Get all reports, optionally filtered by type"""
    query = db.query(Report)
    if report_type:
        query = query.filter(Report.report_type == report_type)
    return query.order_by(Report.generated_at.desc()).all()

def get_report(db: Session, report_id: int) -> Report:
    """Get specific report"""
    return db.query(Report).filter(Report.id == report_id).first()
