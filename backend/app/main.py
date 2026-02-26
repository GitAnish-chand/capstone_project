from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api_router import api_router
from app.core.database import Base, engine

# Import all models to ensure they are registered with SQLAlchemy
import app.models.user
import app.models.course
import app.models.module
import app.models.enrollment
import app.models.progress
import app.models.quiz
import app.models.report
import app.models.chat_history

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Learning Portal Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
