from sqlalchemy import Column, String, TIMESTAMP, Integer, ForeignKey, Text, ARRAY, Enum, UniqueConstraint
from pydantic import BaseModel
from typing import Optional
from database import Base
import enum
from sqlalchemy.orm import relationship
import uuid
from sqlalchemy.dialects.postgresql import UUID


# --- Database tables --- #
    
class Course(Base):
    __tablename__ = "courses"
    course_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_name = Column(String, nullable=False)
    course_desc = Column(Text, nullable=True, default="") 
    course_difficulty = Column(Integer, nullable=True, default=0)
    
    def __repr__(self):
        return f"<Course(id={self.course_id}, name={self.course_name}, difficulty={self.course_difficulty})>"
    
class Lesson(Base):
    __tablename__ = "lessons"
    lesson_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lesson_name = Column(String, nullable=False)
    lesson_desc = Column(Text, nullable=True)
    lesson_type = Column(String, nullable=False)  
    
    def __repr__(self):
        return f"<Lesson(id={self.lesson_id}, name={self.lesson_name}, type={self.lesson_type})>"  
    
    model_config = {
        "arbitrary_types_allowed": True
    }

class Question(Base):
    __tablename__ = 'questions'

    question_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_type = Column(String, nullable =False)
    question_target = Column(String, nullable=False)
    question_choice = Column(String, nullable=True)  

    def __repr__(self):
        return f"<Question(id={self.question_id}, type={self.question_type}, target={self.question_target})>"
    
    model_config = {
        "arbitrary_types_allowed": True
    }

class CourseLesson(Base):
    __tablename__ = "course_lessons"
    cl_entries_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.course_id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.lesson_id"), nullable=False)
    index_in_course = Column(Integer, nullable=False)
    

class LessonQuestion(Base):
    __tablename__ = "lesson_questions" 
    lq_entries_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.lesson_id"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.question_id"), nullable=False)
    index_in_lesson = Column(Integer, nullable=False)
    

    model_config = {
        "arbitrary_types_allowed": True
    }


# --- Pydantic Schemas --- #

from pydantic import Field

class CourseCreate(BaseModel):
    course_name: str 
    course_desc: Optional[str] = None
    course_difficulty: Optional[int] = 0

class CourseRead(BaseModel):
    course_id: uuid.UUID
    course_name: str 
    course_desc: Optional[str] = None
    course_difficulty: Optional[int] = 0

    model_config = {
        "arbitrary_types_allowed": True
    }

class CourseUpdate(BaseModel):
    course_id: uuid.UUID
    course_name: Optional[str] = None 
    course_desc: Optional[str] = None 
    course_difficulty: Optional[int] = 0

    model_config = {
        "arbitrary_types_allowed": True
    }

class CourseDelete(BaseModel):
    course_id: uuid.UUID

    model_config = {
        "arbitrary_types_allowed": True
    }


class LessonCreate(BaseModel):
    lesson_name: str 
    lesson_desc: Optional[str] = None
    lesson_type: str

    model_config = {
        "arbitrary_types_allowed": True
    }

class LessonRead(BaseModel):
    lesson_id: uuid.UUID
    lesson_name: str 
    lesson_desc: Optional[str] = None
    lesson_type: str

    model_config = {
        "arbitrary_types_allowed": True
    }

class LessonUpdate(BaseModel):
    lesson_id: uuid.UUID 
    lesson_name: Optional[str] = None 
    lesson_desc: Optional[str] = None 
    lesson_type: Optional[str] = None 

    model_config = {
        "arbitrary_types_allowed": True
    }

class LessonDelete(BaseModel):
    lesson_id: uuid.UUID

    model_config = {
        "arbitrary_types_allowed": True
    }


class QuestionCreate(BaseModel):
    question_type: str
    question_target: str
    question_choice: Optional[str] = None

    model_config = {
        "arbitrary_types_allowed": True
    }

class QuestionRead(BaseModel):
    question_id: uuid.UUID
    question_type: str
    question_target: str
    question_choice: Optional[str] = None

    model_config = {
        "arbitrary_types_allowed": True
    }

class QuestionUpdate(BaseModel):
    question_id: uuid.UUID
    question_type: Optional[str] = None
    question_target: Optional[str] = None
    question_choice: Optional[str] = None

    model_config = {
        "arbitrary_types_allowed": True
    }

class QuestionDelete(BaseModel):
    question_id: uuid.UUID

    model_config = {
        "arbitrary_types_allowed": True
    }


class CourseLessonCreate(BaseModel):
    course_id: uuid.UUID
    lesson_id: uuid.UUID
    index_in_course: Optional[int] = None

    model_config = {
        "arbitrary_types_allowed": True
    }

class CourseLessonRead(BaseModel):
    cl_entries_id: uuid.UUID
    course_id: uuid.UUID
    lesson_id: uuid.UUID
    index_in_course: int

    model_config = {
        "arbitrary_types_allowed": True
    }

class CourseLessonDelete(BaseModel):
    cl_entries_id: uuid.UUID

    model_config = {
        "arbitrary_types_allowed": True
    }


class LessonQuestionCreate(BaseModel):
    lesson_id: uuid.UUID
    question_id: uuid.UUID
    index_in_lesson: Optional[int] = None

    model_config = {
        "arbitrary_types_allowed": True
    }

class LessonQuestionRead(BaseModel):
    lq_entries_id: uuid.UUID
    lesson_id: uuid.UUID
    question_id: uuid.UUID
    index_in_lesson: Optional[int] = None

    model_config = {
        "arbitrary_types_allowed": True
    }

class LessonQuestionDelete(BaseModel):
    lq_entries_id: uuid.UUID

    model_config = {
        "arbitrary_types_allowed": True
    }


class GetLessonProgress(BaseModel):
    progress_id: uuid.UUID 