from sqlalchemy import Column, String, TIMESTAMP, Integer, ForeignKey, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from api.database import Base
from sqlalchemy.orm import relationship
import uuid


class Question(Base):
    __tablename__ = 'questions'
    
    question_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.course_id", onupdate='CASCADE', ondelete='RESTRICT'), nullable=False)
    question_type = Column(String, nullable=False)
    question_order = Column(Integer, nullable=False)
    
    # Relationships
    course = relationship('Course', back_populates="questions")
    choice_question = relationship('ChoiceQuestion', back_populates='question', cascade="all, delete-orphan", uselist=False)
    input_question = relationship('InputQuestion', back_populates='question', cascade="all, delete-orphan", uselist=False)
    practice_sessions = relationship('PracticeSession', back_populates='question', cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Question(id={self.question_id}, type={self.question_type})>"


class ChoiceQuestion(Base):
    __tablename__ = "choice_questions"
    
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.question_id", onupdate="CASCADE", ondelete="RESTRICT"), primary_key=True)
    image_url = Column(Text, nullable=False)
    correct_answer = Column(String, nullable=False)
    options = Column(ARRAY(String))
    
    question = relationship('Question', back_populates="choice_question")
    
    def __repr__(self):
        return f"<ChoiceQuestion(id={self.question_id}, image_url={self.image_url})>"


class InputQuestion(Base):
    __tablename__ = "input_questions"
    
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.question_id", onupdate="CASCADE", ondelete="RESTRICT"), primary_key=True)
    target_text = Column(Text, nullable=False)
    text_type = Column(String, nullable=False)
    
    question = relationship('Question', back_populates="input_question")
    
    def __repr__(self):
        return f"<InputQuestion(id={self.question_id}, target_text={self.target_text})>"
