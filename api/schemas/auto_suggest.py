from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from uuid import UUID
from datetime import datetime

# Schema for new auto suggest
class AutoSuggestCreate(BaseModel):
    detection_id: UUID
    suggested_text: Optional[List[str]] = None
    
    model_config = ConfigDict(from_attributes=True)
    
    
    
# Schema for update when user chooses a suggestion or move on()
class AutoSuggestUpdate(BaseModel):
    accepted_text: Optional[str] = None
    accepted_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

# Schema for response
class AutoSuggest(BaseModel):
    detection_id: UUID
    suggested_text: Optional[List[str]] = None
    accepted_text: Optional[str] = None
    accepted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)