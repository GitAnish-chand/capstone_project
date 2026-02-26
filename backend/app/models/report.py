from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    generated_by = Column(Integer, ForeignKey("users.id"))  # Admin who generated report
    report_type = Column(String(50))  # completion / engagement / performance / user_progress
    title = Column(String(200))
    data = Column(JSON)

    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    admin = relationship("User")
