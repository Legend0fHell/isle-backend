from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from models.question import (
    LessonCreate, LessonRead, LessonUpdate,
    LessonQuestionCreate, LessonQuestionRead,
)
from database import get_db
import crud.question as crud

router = APIRouter(prefix="/lesson", tags=["Lessons"])

# Lesson endpoints
@router.post("/create")
def create_lesson(lesson: LessonCreate, db: Session = Depends(get_db)):
    return {"msg": "ok", "data": crud.create_lesson(db, lesson)}

@router.get("/info")
def get_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    lesson_data = crud.get_lesson(db, lesson_id)
    if lesson_data is None:
        return {"msg": "error", "data": lesson_data}
    return {"msg": "ok", "data": lesson_data}

@router.put("/update")
def update_lesson(lesson: LessonUpdate, db: Session = Depends(get_db)):
    return {"msg": "ok", "data": crud.update_lesson(db, lesson)}

@router.delete("/delete")
def delete_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "ok", "data": crud.delete_lesson(db, lesson_id)}

# LessonQuestion endpoints
@router.post("/lesson-question/create")
def create_lesson_question(lq: LessonQuestionCreate, db: Session = Depends(get_db)):
    lesson_question_data = crud.create_lesson_question(db, lq)
    if lesson_question_data is None:
        return {"msg": "error", "data": lesson_question_data}
    return {"msg": "ok", "data": lesson_question_data}

@router.get("/lesson-question")
def get_lesson_questions(lesson_id: UUID, db: Session = Depends(get_db)):
    lesson_question_data = crud.get_lesson_questions(db, lesson_id)
    if lesson_question_data is None:
        return {"msg": "error", "data":None}
    return {"msg": "ok", "data": lesson_question_data}

@router.delete("/lesson-question/delete/")
def delete_lesson_question(lesson_id: UUID, question_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "ok", "data": crud.delete_lesson_questions(db, lesson_id, question_id)}
