from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

# Schema to create new session
class PracticeSessionCreate(BaseModel):
    user_id: UUID
    course_id: UUID
    question_id: UUID
    
# Schema to return information to clients
class PracticeSessionBase(BaseModel):
    session_id: UUID
    user_id: UUID
    course_id: UUID
    question_id: UUID
    question_type: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None


    class Config:
        orm_mode = True
        
class PracticeSessionRead(BaseModel):
    session_id: UUID
    user_id: UUID
    course_id: UUID
    question_id: UUID
    question_type: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True