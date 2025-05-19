from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, TIMESTAMP, BOOLEAN
from pydantic import EmailStr, BaseModel
from api.database import Base
from datetime import datetime
from typing import Optional
import uuid
from sqlalchemy.dialects.postgresql import UUID



# --- Database tables --- #

class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(150), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<User(user_id={self.user_id}, name={self.name}, email={self.email})>"
    
    model_config = {
        "arbitrary_types_allowed": True
    }


class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"
    
    progress_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.lesson_id"), nullable=False)
    last_activity_at = Column(TIMESTAMP, default=datetime.utcnow)
    correct_questions = Column(Integer, default=0)
    
    model_config = {
        "arbitrary_types_allowed": True
    }


class UserQuestionAnswer(Base):
    __tablename__ = "user_question_answers"
    
    progress_id = Column(UUID(as_uuid=True), ForeignKey("user_lesson_progress.progress_id"), primary_key=True)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.question_id"), primary_key=True)
    
    user_choice = Column(String, nullable=True)
    is_correct = Column(BOOLEAN, nullable=True)
    
    model_config = {
        "arbitrary_types_allowed": True
    }


# --- Pydantic Schemas --- #

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

    model_config = {
        "arbitrary_types_allowed": True
    }


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    model_config = {
        "arbitrary_types_allowed": True
    }


class UserUpdate(BaseModel):
    user_id: uuid.UUID
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    password: Optional[str] = None

    model_config = {
        "arbitrary_types_allowed": True
    }


class LessonProgressCreate(BaseModel):
    user_id: uuid.UUID
    lesson_id: uuid.UUID

    model_config = {
        "arbitrary_types_allowed": True
    }
    
class LessonProgressRead(BaseModel):
    progress_id: uuid.UUID
    user_id: uuid.UUID
    lesson_id: uuid.UUID 
    last_activity_at: datetime
    correct_questions: int

    model_config = {
        "arbitrary_types_allowed": True
    }


class UserAnswerCreate(BaseModel):
    progress_id: uuid.UUID
    question_id: uuid.UUID

    model_config = {
        "arbitrary_types_allowed": True
    }


class UserAnswerSubmit(BaseModel):
    progress_id: uuid.UUID
    question_id: uuid.UUID
    user_choice: str

    model_config = {
        "arbitrary_types_allowed": True
    }
    
class UserAnswerRead(BaseModel):
    progress_id: uuid.UUID 
    question_id: uuid.UUID 
    
    model_config = {
        "arbitrary_types_allowed": True
    }

class UserRead(BaseModel):
    user_id: uuid.UUID
    email: EmailStr
    name: str
    created_at: datetime
    last_login: datetime

    model_config = {
        "arbitrary_types_allowed": True
    }
