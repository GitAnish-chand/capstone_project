from fastapi import APIRouter
from app.api.v1.auth.routes import router as auth_router
from app.api.v1.courses.routes import router as courses_router
from app.api.v1.enrollments.routes import router as enrollments_router
from app.api.v1.modules.routes import router as modules_router
from app.api.v1.quizzes.routes import router as quizzes_router
from app.api.v1.reports.routes import router as reports_router
from app.api.v1.chat.routes import router as chat_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(courses_router)
api_router.include_router(enrollments_router)
api_router.include_router(modules_router)
api_router.include_router(quizzes_router)
api_router.include_router(reports_router)
api_router.include_router(chat_router)
