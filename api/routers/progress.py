from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from api.database import get_db
from api.models.user import LessonProgressCreate, UserAnswerSubmit, UserAnswerCreate, UserAnswerRead, LessonProgressRead
from api.models.user import UserRead, UserLogin, UserCreate
from api.crud import progress as crud

router = APIRouter(
    prefix="/api",
    tags=["Progress"]
)

# --- Lesson Progress Endpoints --- #

@router.post("/progress/start")
def start_lesson_progress(data: LessonProgressCreate, db: Session = Depends(get_db)):
    progress = crud.start_lesson_progress(db, data)
    if not progress:
        return {
            "msg": "Failed, can't start progress",
            "data": None
        }
    return {
        "msg": "Start lesson successfully!",
        "data": progress
    }



@router.post("/progress/lesson/")
def get_lesson_progress(user_id: UUID, lesson_id: UUID, db: Session = Depends(get_db)):
    progress = crud.get_lesson_progress(db, user_id, lesson_id)
    if not progress:
        return {
            "msg": "Get lesson progress",
            "data": None
        }
    return {
        "msg": "Get lesson progress",
        "data": {
        "progress_id": progress.progress_id,
        "user_id": progress.user_id,
        "lesson_id": progress.lesson_id,
        "last_activity_at": progress.last_activity_at,
        "correct_questions": progress.correct_questions
    }
    } 


@router.get("/progress/user/{user_id}")
def get_all_lesson_progress(user_id: UUID, db: Session = Depends(get_db)):
    progress_list = crud.get_lesson_progress_by_user(db, user_id)
    if not progress_list:
        return {
            "msg": "Get user learning progress",
            "data": None
        }
        
    return {
        "msg": "Get user learning progress",
        
        "data": [
        {
            "progress_id": p.progress_id,
            "user_id": p.user_id,
            "lesson_id": p.lesson_id,
            "last_activity_at": p.last_activity_at,
            "correct_questions": p.correct_questions
        } for p in progress_list
    ]}


# --- UserQuestionAnswer Endpoints --- #

@router.post("/progress/answer/create")
def create_user_question_answer(data: UserAnswerCreate, db: Session = Depends(get_db)):
    answer = crud.create_user_question_answer(db, data)
    if not answer:
        return {
            "msg": "User start the question",
            "data": None 
        }
    return {
        "msg": "User start the question",
        "data" : {
        "progress_id": answer.progress_id,
        "question_id": answer.question_id
    }}


@router.get("/progress/answer/{progress_id}/{question_id}")
def get_user_question_answer(progress_id: UUID, question_id: UUID, db: Session = Depends(get_db)):
    answer = crud.get_user_question_answer(db, progress_id, question_id)
    if not answer:
        return {
            "msg": "Get answer from user",
            "data": None}
        
    return {
        "msg": "Get answer from user",
        "data": {
        "progress_id": answer.progress_id,
        "question_id": answer.question_id,
        "user_choice": answer.user_choice,
        "is_correct": answer.is_correct
    }}


@router.get("/progress/answers/{progress_id}")
def get_user_question_answers_by_lesson(progress_id: UUID, db: Session = Depends(get_db)):
    answers = crud.get_user_question_answers_by_lesson(db, progress_id)
    if not answers:
        return {
            "msg": "Get questions answers by lesson",
            "data": None 
        }
    return {
        
        "msg": "Get questions answers by lesson",
        "data": [
        {
            "progress_id": a.progress_id,
            "question_id": a.question_id,
            "user_choice": a.user_choice,
            "is_correct": a.is_correct
        } for a in answers
    ]}


@router.post("/progress/answer/submit")
def submit_user_answer(data: UserAnswerSubmit, db: Session = Depends(get_db)):
    answer = crud.submit_user_answer(db, data)
    if not answer: 
        return {
            "msg": "User submit answer",
            "data": None 
        }
    return { 
     "msg": "User submit answer",   
    "data" : {
        "progress_id": answer.progress_id,
        "question_id": answer.question_id,
        "user_choice": answer.user_choice,
        "is_correct": answer.is_correct
    }
    }

@router.post("/course/progress")
def get_user_course_progress(user_id: UUID, db: Session = Depends(get_db)):
    return crud.track_user_progress(db, user_id)

    