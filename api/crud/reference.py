from sqlalchemy.orm import Session
from api.models.alphabet import ASLCharacter
from api.models.alphabet import ASLCreate, ASLRead
from sqlalchemy import func

from fastapi import HTTPException, status

""" 
class ASLCharacter(Base):
    __tablename__ = "asl_characters"
    
    char_name = Column(String, primary_key=True)
    char_image_url = Column(Text, nullable=False)
    char_tutorial_text = Column(Text, nullable=True)
    char_tutorial_url = Column(Text, nullable=True)  # URL to tutorial video
"""

def get_all_letters(db: Session):
    return db.query(ASLCharacter).all()

def get_letter(db: Session, letter: str):
    asl_letter = db.query(ASLCharacter).filter(func.lower(func.trim(ASLCharacter.char_name)) == letter.strip().lower()).first()
    
    if not asl_letter:
        return None
        
    return asl_letter

def create_letter(db: Session, alphabet_in: ASLCreate):
    letter = db.query(ASLCharacter).filter( func.lower(func.trim(ASLCharacter.char_name)) == alphabet_in.char_name.strip().lower()).first()
    
    if letter:
        return None
        
    db_letter = ASLCharacter(
        char_name = alphabet_in.char_name,
        char_image_url = alphabet_in.char_image_url,
        char_tutorial_text = alphabet_in.char_tutorial_text,
        char_tutorial_url = alphabet_in.char_tutorial_url
    )
    
    db.add(db_letter)
    db.commit()
    db.refresh(db_letter)
    return db_letter


def update_letter(db: Session, data: ASLCreate):
    db_letter = get_letter(db, data.char_name) 

    for field, value in data.dict(exclude_unset=True).items():
        setattr(db_letter, field, value)

    db.commit()
    db.refresh(db_letter)
    return db_letter


def delete_letter(db: Session, letter: str):
    db_letter = get_letter(db, letter)
    db.delete(db_letter)
    db.commit()
    return f"ASL letter '{letter}' deleted successfully"
