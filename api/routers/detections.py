from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime
from api.database import get_db
from api.models.detected_sign import DetectedSign as DetectedSignModel
from api.schemas.detected_sign import DetectedSignCreate, DetectedSign
from api.schemas.auto_suggest import AutoSuggest, AutoSuggestCreate
from api.schemas.quickfix import Quickfix, QuickfixCreate
from api.models.user import User
from api.services.generator_suggest import generate_auto_suggest, generate_quickfix
from api.crud import suggest

from pydantic import BaseModel


router = APIRouter(
    prefix="/detections",
    tags=["detections"]
)


class FullDetectionResult(BaseModel):
    detection: DetectedSign
    auto_suggest: AutoSuggest
    quickfix: Quickfix

    class Config:
        orm_mode = True


"""
# Schema for detected sign
class DetectedSignCreate(BaseModel):
    user_id: UUID
    detected_character: str
    current_user_text: str
    image_data: Optional[List[str]] = None
    
    
# Schema return to clients
class DetectedSign(BaseModel):
    detection_id: UUID
    user_id: UUID
    detected_character: str
    current_user_text: str
    image_data: Optional[List[str]] = None
    created_at: datetime

    class Config:
        orm_mode = True
"""

@router.post("/suggests", response_model=FullDetectionResult)
def full_detection_process(
    detected_sign: DetectedSignCreate,
    db: Session = Depends(get_db)
):
    # check user id
    user = db.query(User).filter(User.email == detected_sign.user_email).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    
    # 1. Tạo DetectedSign
    detection_obj = DetectedSignModel(
        detection_id=uuid4(),
        user_id=user.user_id,
        detected_character=detected_sign.detected_character,
        current_user_text=detected_sign.current_user_text,
        image_data=detected_sign.image_data,
        created_at=datetime.utcnow()
    )
    db.add(detection_obj)
    db.commit()
    db.refresh(detection_obj)

    # 2. Tạo AutoSuggest và Quickfix
    auto_suggest_data: AutoSuggestCreate = generate_auto_suggest(detection_obj)
    quickfix_data: QuickfixCreate = generate_quickfix(detection_obj)

    # 3. Ghi vào DB
    auto_suggest_obj: AutoSuggest = suggest.create_auto_suggest(db, auto_suggest_data)
    quickfix_obj: Quickfix = suggest.create_quickfix(db, quickfix_data)

    # 4. Trả response về
    return FullDetectionResult(
        detection=DetectedSign.from_orm(detection_obj),
        auto_suggest=AutoSuggest.from_orm(auto_suggest_obj),
        quickfix=Quickfix.from_orm(quickfix_obj)
    )
    
    
  