from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from uuid import UUID

from database import get_db
from models.user import (
    LessonProgressCreate, UserAnswerSubmit, UserAnswerCreate, 
    UserAnswerRead, LessonProgressRead, UserRead, UserLogin, UserCreate, User
)
from models.question import GetLessonProgress
from models.question import Lesson
from crud import progress as crud

router = APIRouter(
    tags=["Progress"]
)

# --- Lesson Progress Endpoints --- #

@router.get("/progress/lesson")
def get_lesson_progress(user_id: UUID = Body(..., embed=True), lesson_id: UUID = Body(..., embed=True), db: Session = Depends(get_db)):
    """Retrieve progress record for a specific user and lesson"""
    progress = crud.get_lesson_progress(db, user_id, lesson_id)
    if not progress:
        return {
            "msg": "error",
            "data": None
        }
    return {
        "msg": "ok",
        "data": {
            "progress_id": progress.progress_id,
            "user_id": progress.user_id,
            "lesson_id": progress.lesson_id,
            "last_activity_at": progress.last_activity_at,
            "correct_questions": progress.correct_questions
        }
    } 

@router.get("/progress/course")
def get_all_lesson_progress(user_id: UUID, db: Session = Depends(get_db)):
    """Retrieve all lesson progress records for a given user"""
    progress_list = crud.get_lesson_progress_by_user(db, user_id)
    if progress_list is None:
        return {
            "msg": "error",
            "data": None
        }
    return {
        "msg": "ok",
        "data": [
            {
                "progress_id": p.progress_id,
                "user_id": p.user_id,
                "lesson_id": p.lesson_id,
                "last_activity_at": p.last_activity_at,
                "correct_questions": p.correct_questions
            } for p in progress_list
        ]
    }

# --- User Question Answer Endpoints --- #

@router.get("/progress/{progress_id}/answers")
def get_user_question_answers_by_progress(progress_id: UUID, db: Session = Depends(get_db)):
    """Get all question answers associated with a lesson progress"""
    return crud.get_user_question_answers_by_lesson(db, progress_id)

@router.post("/lesson/start")
def start_lesson_progress(user_id: UUID, lesson_id: UUID, db: Session = Depends(get_db)):
    past_progress = crud.get_user_recent_lesson_progress(db, user_id, lesson_id)
    if past_progress['data']['progress'] is not None:
        return past_progress

    """Start tracking progress for a lesson for a user"""
    data = LessonProgressCreate(user_id=user_id, lesson_id=lesson_id)
    progress = crud.start_lesson_progress(db, data)
    if not progress:
        return {
            "msg": "error",
            "data": None
        }
    return {
        "msg": "ok",
        "data": {
            "progress": progress,
            "user_answers": []
        }
    }

@router.post("/lesson/check")
def submit_user_answer(data: UserAnswerSubmit, db: Session = Depends(get_db)):
    """Submit user's answer to a question and update correctness"""
    feedback = crud.submit_user_answer(db, data)
    if not feedback: 
        return {
            "msg": "error",
            "data": None 
        }
    return feedback
