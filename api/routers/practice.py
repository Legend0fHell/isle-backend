from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import datetime
from typing import Optional

from api.schemas.practice_session import PracticeSessionCreate, PracticeSessionBase, PracticeSessionRead
from api.crud import practice
from api.database import get_db
from api.models.practice_session import PracticeSession

router = APIRouter(
    prefix="/practice",
    tags=["practice"]
)

# Get all sessions by user
@router.get("/user/{user_id}", response_model=List[PracticeSessionBase])
def get_sessions_by_user(user_id: UUID, db: Session = Depends(get_db)):
    return practice.get_all_sessions_by_user(db, str(user_id))


# Get session by ID
@router.get("/{session_id}", response_model=PracticeSessionBase)
def get_session_by_id(session_id: UUID, db: Session = Depends(get_db)):
    session = practice.get_practice_session(db, str(session_id))
    if not session:
        raise HTTPException(status_code=404, detail="Practice session not found")
    return session


# Create new session
@router.post("/", response_model=PracticeSessionBase, status_code=status.HTTP_201_CREATED)
def create_session(session_data: PracticeSessionCreate, db: Session = Depends(get_db)):
    return practice.create_practice_session(db, session_data)



"""
class PracticeSessionBase(BaseModel):
    session_id: UUID
    user_id: UUID
    course_id: UUID
    question_id: UUID
    question_type: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
"""

# session completion, update completed time
@router.put("/{session_id}/complete", response_model=PracticeSessionBase)
def complete_session(session_id: UUID, db: Session = Depends(get_db)):
    completed_at = datetime.utcnow()
    updated = practice.update_practice_session_completion(db, str(session_id), completed_at=completed_at)
    if not updated:
        raise HTTPException(status_code=404, detail="Practice session not found")
    return updated

@router.patch("/complete/", response_model=PracticeSessionRead)
def mark_session_complete(
    user_id: str,
    question_id: str,
    completed_at: Optional[datetime] = None,
    db: Session = Depends(get_db)
) -> PracticeSession:
    """
    Mark a practice session as completed using user_id and question_id.
    """
    return practice.update_practice_session_completion(
        db=db,
        user_id=user_id,
        question_id=question_id,
        completed_at=completed_at
    )