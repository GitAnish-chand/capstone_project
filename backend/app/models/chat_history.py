from sqlalchemy import Column, Integer, ForeignKey, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)  # Optional course context
    question = Column(Text)
    answer = Column(Text)
    context = Column(String(100))  # general / course-specific / quiz-help

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    course = relationship("Course")
