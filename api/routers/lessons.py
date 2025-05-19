from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from api.models.question import (
    LessonCreate, LessonRead, LessonUpdate,
    LessonQuestionCreate, LessonQuestionRead,
)
from api.database import get_db
import api.crud.question as crud

router = APIRouter(prefix="/api", tags=["Lessons"])

# Lesson endpoints
@router.post("/lesson/")
def create_lesson(lesson: LessonCreate, db: Session = Depends(get_db)):
    return {"msg": "Lesson created", "data": crud.create_lesson(db, lesson)}

@router.get("/lesson/info")
def get_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    lesson_data = crud.get_lesson(db, lesson_id)
    if lesson_data is None:
        return {"msg": "Lesson not found", "data": lesson_data}
    return {"msg": "Get lesson", "data": lesson_data}

@router.put("/lesson/update")
def update_lesson(lesson: LessonUpdate, db: Session = Depends(get_db)):
    return {"msg": "Lesson updated", "data": crud.update_lesson(db, lesson)}

@router.delete("/lessons/delete")
def delete_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Lesson deleted", "data": crud.delete_lesson(db, lesson_id)}

# LessonQuestion endpoints
@router.post("/lesson-question/create")
def create_lesson_question(lq: LessonQuestionCreate, db: Session = Depends(get_db)):
    lesson_question_data = crud.create_lesson_question(db, lq)
    if lesson_question_data is None:
        return {"msg": "Lesson or Question not found", "data": lesson_question_data}
    return {"msg": "Lesson question created", "data": lesson_question_data}

@router.get("/lessons/lesson-question")
def get_lesson_questions(lesson_id: UUID, db: Session = Depends(get_db)):
    lesson_question_data = crud.get_lesson_questions(db, lesson_id)
    if lesson_question_data is None:
        return {"msg": "Lesson questions not found", "data":None}
    return {"msg": "Get lesson questions by lesson id", "data": lesson_question_data}

@router.delete("/lesson/question/delete/")
def delete_lesson_question(lesson_id: UUID, question_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Lesson question deleted", "data": crud.delete_lesson_questions(db, lesson_id, question_id)}
