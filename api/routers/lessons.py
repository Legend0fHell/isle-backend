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

@router.get("/lesson/info/{lesson_id}")
def get_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Get lesson", "data": crud.get_lesson(db, lesson_id)}

@router.put("/lesson/update")
def update_lesson(lesson: LessonUpdate, db: Session = Depends(get_db)):
    return {"msg": "Lesson updated", "data": crud.update_lesson(db, lesson)}

@router.delete("/lessons/delete/{lesson_id}")
def delete_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Lesson deleted", "data": crud.delete_lesson(db, lesson_id)}

# LessonQuestion endpoints
@router.post("/lesson-question/create/")
def create_lesson_question(lq: LessonQuestionCreate, db: Session = Depends(get_db)):
    return {"msg": "Lesson question created", "data": crud.create_lesson_question(db, lq)}

@router.get("/lessons/{lesson_id}/lesson-question")
def get_lesson_questions(lesson_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Get lesson questions by lesson id", "data": crud.get_lesson_questions(db, lesson_id)}

@router.delete("/lesson/{lesson_id}/question/{question_id}/delete/")
def delete_lesson_question(lesson_id: UUID, question_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Lesson question deleted", "data": crud.delete_lesson_questions(db, lesson_id, question_id)}
