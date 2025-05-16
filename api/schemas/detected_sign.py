from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
from uuid import UUID
from datetime import datetime

# Schema for detected sign
class DetectedSignCreate(BaseModel):
    user_email: EmailStr
    detected_character: str
    current_user_text: str
    image_data: Optional[List[str]] = None
    
    model_config = ConfigDict(from_attributes=True)
    
    
# Schema return to clients
class DetectedSign(BaseModel):
    detection_id: UUID
    user_id: UUID
    detected_character: str
    current_user_text: str
    image_data: Optional[List[str]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)