from sqlalchemy import Column, String, TIMESTAMP, Text, Enum, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from api.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

DIFFICULTY = ('easy', 'medium', 'hard')

class Course(Base):
    __tablename__ = 'courses'

    course_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(250), nullable=False)
    description = Column(Text, default="")
    
    # Dùng Enum để giới hạn lựa chọn hợp lệ
    difficulty_level = Column(Enum(*DIFFICULTY, name="difficulty_enum"), nullable=False)
    
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    questions = relationship('Question', back_populates='course')
    enrollments = relationship('UserCourseEnrollment', back_populates='course')
    practice_sessions = relationship('PracticeSession', back_populates='course')

    def __repr__(self):
        return f"<Course(course_id={self.course_id}, name={self.name})>"


class UserCourseEnrollment(Base):
    __tablename__ = 'user_course_enrollments'
    
    enrollment_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.course_id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    
    enrolled_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    completed_at = Column(TIMESTAMP, nullable=True)
    
    progress = Column(Float, nullable=False, default=0.0)
    
    # Relationships
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    
    
    def __repr__(self):
        return f"<UserCourseEnrollment(enrollment_id={self.enrollment_id}, user_id={self.user_id}, course_id={self.course_id})>"