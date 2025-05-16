from sqlalchemy import Column, String, Integer, Float, TIMESTAMP, ForeignKey 
from sqlalchemy.dialects.postgresql import UUID, JSONB 
from api.database import Base
from sqlalchemy.orm import relationship 
from datetime import datetime 
import uuid 


class PracticeSession(Base):
    __tablename__ = "practice_sessions"
    
    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.course_id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.question_id", onupdate="CASCADe", ondelete="RESTRICT"), nullable=False)
    
    question_type = Column(String, nullable=True)
    started_at = Column(TIMESTAMP, nullable=False ,default=datetime.utcnow)
    completed_at = Column(TIMESTAMP, nullable=True)
    
    

    # Relationships 
    user = relationship("User", back_populates="practice_sessions")
    course = relationship("Course", back_populates="practice_sessions")
    question = relationship("Question", back_populates="practice_sessions")
    
    
    def __repr__(self):
        return f"<PracticeSession(session_id={self.session_id}, user_id={self.user_id}, course_id={self.course_id}, question_id={self.question_id})>"
    
    
    

