from sqlalchemy import Column, String, Integer, DateTime, ForeignKey 
from api.models.detected_sign import DetectedSign  
from sqlalchemy.orm import relationship 
from api.database import Base
from datetime import datetime 
from sqlalchemy.dialects.postgresql import UUID


class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(UUID(as_uuid=True), primary_key=True)
    email = Column(String(150), unique=True, nullable=False)
    user_name = Column(String(150), nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)
    
    # Relationship for enrolled users
    enrollments = relationship("UserCourseEnrollment", back_populates='user')
    practice_sessions = relationship("PracticeSession", back_populates='user')
    detected_signs = relationship("DetectedSign", back_populates='user')
    
    def __repr__(self):
        return f"<User(user_id={self.user_id}, user_name={self.user_name}, email={self.email})>"