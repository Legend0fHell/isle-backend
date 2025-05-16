from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from uuid import UUID


# Schema for new Quickfix
class QuickfixCreate(BaseModel):
    detection_id: UUID
    misspelling_word: str
    quickfix_suggests: Optional[List[str]] = None
    
    model_config = ConfigDict(from_attributes=True)


# Schema for update of user option
class QuickfixUpdate(BaseModel):
    chosen_suggest: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# Response schema
class Quickfix(BaseModel):
    fix_id: UUID
    detection_id: UUID
    misspelling_word: str
    quickfix_suggests: Optional[List[str]] = None
    chosen_suggest: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
