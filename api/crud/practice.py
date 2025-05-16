from uuid import uuid4
from datetime import datetime
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from api.models.practice_session import PracticeSession
from api.models.user import User
from api.models.course import Course
from api.models.question import Question
from api.schemas.practice_session import PracticeSessionCreate


def get_entity_or_404(db: Session, model, entity_id, entity_name: str):
    entity = db.query(model).filter(model.__table__.primary_key.columns.values()[0] == entity_id).first()
    if not entity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{entity_name} with id {entity_id} does not exist."
        )
    return entity


def create_practice_session(db: Session, session_in: PracticeSessionCreate) -> PracticeSession:
    # Validate user and course existence
    get_entity_or_404(db, User, session_in.user_id, "User")
    get_entity_or_404(db, Course, session_in.course_id, "Course")

    # Fetch question and use its type
    question = get_entity_or_404(db, Question, session_in.question_id, "Question")

    new_session = PracticeSession(
        session_id=uuid4(),
        user_id=session_in.user_id,
        course_id=session_in.course_id,
        question_id=session_in.question_id,
        question_type=question.question_type,  
        started_at=datetime.utcnow(),
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session



def get_practice_session(db: Session, session_id: str) -> Optional[PracticeSession]:
    return db.query(PracticeSession).filter(PracticeSession.session_id == session_id).first()


def get_all_sessions_by_user(db: Session, user_id: str) -> list[PracticeSession]:
    return db.query(PracticeSession).filter(PracticeSession.user_id == user_id).all()

##

def update_practice_session_completion(
    db: Session, user_id: str, question_id: str, completed_at: Optional[datetime] = None
) -> Optional[PracticeSession]:
    # Find session for both the user and question
    session = db.query(PracticeSession).filter(
        PracticeSession.user_id == user_id,
        PracticeSession.question_id == question_id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Practice session for user_id {user_id} and question_id {question_id} not found."
        )

    session.completed_at = completed_at or datetime.utcnow()
    db.commit()
    db.refresh(session)
    return session

##

def update_practice_session_completion_session_id(
    db: Session, session_id: str, completed_at: Optional[datetime] = None
) -> Optional[PracticeSession]:
    session = db.query(PracticeSession).filter(PracticeSession.session_id == session_id).first()
    if not session:
        return None

    session.completed_at = completed_at or datetime.utcnow()
    db.commit()
    db.refresh(session)
    return session