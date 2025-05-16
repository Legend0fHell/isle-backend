from sqlalchemy.orm import Session
from api.models.alphabet import ASLAlphabetReference
from api.schemas.alphabet import ASLAlphabetReferenceCreate

def get_all_letters(db: Session):
    return db.query(ASLAlphabetReference).all()

def get_letter(db: Session, letter: str):
    return db.query(ASLAlphabetReference).filter(ASLAlphabetReference.letter == letter).first()

def create_letter(db: Session, alphabet_in: ASLAlphabetReferenceCreate):
    db_letter = ASLAlphabetReference(**alphabet_in.dict())
    db.add(db_letter)
    db.commit()
    db.refresh(db_letter)
    return db_letter
