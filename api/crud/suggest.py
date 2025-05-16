from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import uuid

from api.models.auto_suggest import AutoSuggest, Quickfix
from api.schemas.auto_suggest import AutoSuggestCreate, AutoSuggestUpdate
from api.schemas.quickfix import QuickfixCreate, QuickfixUpdate

# --- CRUD for AutoSuggest ---
def create_auto_suggest(db: Session, auto_suggest_in: AutoSuggestCreate) -> AutoSuggest:
    db_obj = AutoSuggest(
        detection_id=auto_suggest_in.detection_id,
        suggested_text=auto_suggest_in.suggested_text,
        accepted_text=None,
        accepted_at=None,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_auto_suggest(db: Session, detection_id: str) -> Optional[AutoSuggest]:
    return db.query(AutoSuggest).filter(AutoSuggest.detection_id == detection_id).first()

def update_auto_suggest(db: Session, detection_id: str, auto_suggest_update: AutoSuggestUpdate) -> Optional[AutoSuggest]:
    db_obj = db.query(AutoSuggest).filter(AutoSuggest.detection_id == detection_id).first()
    if not db_obj:
        return None
    update_data = auto_suggest_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    if "accepted_text" in update_data and db_obj.accepted_at is None:
        db_obj.accepted_at = datetime.utcnow()
    db.commit()
    db.refresh(db_obj)
    return db_obj


# --- CRUD for Quickfix ---

def create_quickfix(db: Session, quickfix_in: QuickfixCreate) -> Quickfix:
    db_obj = Quickfix(
        fix_id=str(uuid.uuid4()),
        detection_id=quickfix_in.detection_id,
        misspelling_word=quickfix_in.misspelling_word,
        quickfix_suggests=quickfix_in.quickfix_suggests,
        chosen_suggest=None,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_quickfix(db: Session, fix_id: str) -> Optional[Quickfix]:
    return db.query(Quickfix).filter(Quickfix.fix_id == fix_id).first()

def update_quickfix(db: Session, fix_id: str, quickfix_update: QuickfixUpdate) -> Optional[Quickfix]:
    db_obj = db.query(Quickfix).filter(Quickfix.fix_id == fix_id).first()
    if not db_obj:
        return None
    update_data = quickfix_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj