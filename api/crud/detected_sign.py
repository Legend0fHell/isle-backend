from sqlalchemy.orm import Session
from api.models.detected_sign import DetectedSign
from api.schemas.detected_sign import DetectedSignCreate
from typing import List, Optional
import uuid
from datetime import datetime

def create_detected_sign(db: Session, detected_sign_in: DetectedSignCreate) -> DetectedSign:
    new_detection = DetectedSign(
        detection_id=str(uuid.uuid4()),
        user_id=detected_sign_in.user_id,
        detected_character=detected_sign_in.detected_character,
        current_user_text=detected_sign_in.current_user_text,
        image_data=detected_sign_in.image_data,
        created_at=datetime.utcnow()
    )
    db.add(new_detection)
    db.commit()
    db.refresh(new_detection)
    return new_detection

def get_detected_signs_by_user_id(db: Session, user_id: str, skip: int = 0, limit: int = 100) -> List[DetectedSign]:
    return db.query(DetectedSign)\
        .filter(DetectedSign.user_id == user_id)\
        .order_by(DetectedSign.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()