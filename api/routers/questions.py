from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from api.models.question import (
    QuestionCreate, QuestionRead, QuestionUpdate,
)
from api.database import get_db
import api.crud.question as crud

router = APIRouter(prefix="/api", tags=["Questions"])

# Question endpoints
@router.post("/question/")
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    return {"msg": "Question created", "data": crud.create_question(db, question)}

@router.get("/question/info/{question_id}")
def get_question(question_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Question info", "data": crud.get_question(db, question_id)}

@router.put("/question/update/")
def update_question(question: QuestionUpdate, db: Session = Depends(get_db)):
    return {"msg": "Question updated", "data": crud.update_question(db, question)}

@router.delete("/question/delete/{question_id}")
def delete_question(question_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Question deleted", "data": crud.delete_question(db, question_id)}

@router.get("/lessons/{lesson_id}/questions")
def get_questions_in_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Get questions by lesson", "data": crud.get_question_by_lesson(db, lesson_id)}
