from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from models.question import (
    QuestionCreate, QuestionRead, QuestionUpdate,
)
from database import get_db
import crud.question as crud

router = APIRouter(prefix="/question", tags=["Questions"])

# Question endpoints
@router.post("/")
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    question_data = crud.create_question(db, question)
    if question_data is None:
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": question_data}

@router.post("/info/{question_id}")
def get_question(question_id: UUID, db: Session = Depends(get_db)):
    question_data = crud.get_question(db, question_id)
    if question_data is None: 
        return {"msg": "error", "data": question_data}
    return {"msg": "ok", "data": question_data}


@router.put("/update/")
def update_question(question: QuestionUpdate, db: Session = Depends(get_db)):
    question_data = crud.update_question(db, question)
    if question_data is None:
        return {"msg": "error", "data": None}
    return {"msg": "ok", "data": question_data}


@router.delete("/delete/{question_id}")
def delete_question(question_id: UUID, db: Session = Depends(get_db)):
    question_data = crud.delete_question(db, question_id)
    if question_data is None:
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": None}
