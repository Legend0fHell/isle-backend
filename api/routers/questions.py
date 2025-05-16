from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from api.schemas.question import QuestionCreate, QuestionRead
from api.crud import question  
from api.database import get_db

router = APIRouter(
    prefix="/questions",
    tags=["questions"]
)

@router.get("/course/{course_id}", response_model=List[QuestionRead])
def get_questions_by_course(course_id: UUID, db: Session = Depends(get_db)):
    questions = question.get_questions_by_course_id(db, str(course_id))
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this course")
    return questions

@router.get("/{question_id}", response_model=QuestionRead)
def get_question(question_id: UUID, db: Session = Depends(get_db)):
    db_question = question.get_question_by_id(db, str(question_id))
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    return db_question

@router.post("/course/{course_id}", response_model=QuestionRead, status_code=status.HTTP_201_CREATED)
def create_question(course_id: UUID, question_in: QuestionCreate, db: Session = Depends(get_db)):
    new_question = question.create_question(db, course_id=str(course_id), question=question_in)
    return new_question

