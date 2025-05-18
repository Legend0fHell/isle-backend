from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from api.database import get_db
from api.models.user import LessonProgressCreate, UserAnswerSubmit, UserAnswerCreate, UserAnswerRead, LessonProgressRead
from api.models.user import UserRead, UserLogin, UserCreate
from api.crud import progress as crud

router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)

# --- Lesson Progress Endpoints --- #

@router.post("/start", response_model=LessonProgressRead)
def start_lesson_progress(data: LessonProgressCreate, db: Session = Depends(get_db)):
    progress = crud.start_lesson_progress(db, data)
    return {"progress_id": progress.progress_id}


@router.get("/lesson/{user_id}/{lesson_id}", response_model=LessonProgressRead)
def get_lesson_progress(user_id: UUID, lesson_id: UUID, db: Session = Depends(get_db)):
    progress = crud.get_lesson_progress(db, user_id, lesson_id)
    return {
        "progress_id": progress.progress_id,
        "user_id": progress.user_id,
        "lesson_id": progress.lesson_id,
        "last_activity_at": progress.last_activity_at,
        "correct_questions": progress.correct_questions
    }


@router.get("/user/{user_id}", response_model=list[LessonProgressRead])
def get_all_lesson_progress(user_id: UUID, db: Session = Depends(get_db)):
    progress_list = crud.get_lesson_progress_by_user(db, user_id)
    return [
        {
            "progress_id": p.progress_id,
            "user_id": p.user_id,
            "lesson_id": p.lesson_id,
            "last_activity_at": p.last_activity_at,
            "correct_questions": p.correct_questions
        } for p in progress_list
    ]


# --- UserQuestionAnswer Endpoints --- #

@router.post("/answer/create", response_model=UserAnswerRead)
def create_user_question_answer(data: UserAnswerCreate, db: Session = Depends(get_db)):
    answer = crud.create_user_question_answer(db, data)
    return {
        "progress_id": answer.progress_id,
        "question_id": answer.question_id
    }


@router.get("/answer/{progress_id}/{question_id}", response_model=UserAnswerRead)
def get_user_question_answer(progress_id: UUID, question_id: UUID, db: Session = Depends(get_db)):
    answer = crud.get_user_question_answer(db, progress_id, question_id)
    return {
        "progress_id": answer.progress_id,
        "question_id": answer.question_id,
        "user_choice": answer.user_choice,
        "is_correct": answer.is_correct
    }


@router.get("/answers/{progress_id}", response_model=list[UserAnswerRead])
def get_user_question_answers_by_lesson(progress_id: UUID, db: Session = Depends(get_db)):
    answers = crud.get_user_question_answers_by_lesson(db, progress_id)
    return [
        {
            "progress_id": a.progress_id,
            "question_id": a.question_id,
            "user_choice": a.user_choice,
            "is_correct": a.is_correct
        } for a in answers
    ]


@router.post("/answer/submit", response_model=UserAnswerRead)
def submit_user_answer(data: UserAnswerSubmit, db: Session = Depends(get_db)):
    answer = crud.submit_user_answer(db, data)
    return {
        "progress_id": answer.progress_id,
        "question_id": answer.question_id,
        "user_choice": answer.user_choice,
        "is_correct": answer.is_correct
    }
