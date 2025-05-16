from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from api.schemas.alphabet import ASLAlphabetReference, ASLAlphabetReferenceCreate
from api.models.alphabet import ASLAlphabetReference as ASLAlphabetReferenceModel
from api.database import get_db

router = APIRouter(
    prefix="/asl_reference",
    tags=["asl_reference"]
)

@router.get("/", response_model=List[ASLAlphabetReference])
def get_all_letters(db: Session = Depends(get_db)):
    letters = db.query(ASLAlphabetReferenceModel).all()
    return letters

@router.get("/{letter}", response_model=ASLAlphabetReference)
def get_letter(letter: str, db: Session = Depends(get_db)):
    letter_obj = db.query(ASLAlphabetReferenceModel).filter(ASLAlphabetReferenceModel.letter == letter).first()
    if not letter_obj:
        raise HTTPException(status_code=404, detail="Letter not found")
    return letter_obj

@router.post("/", response_model=ASLAlphabetReference, status_code=status.HTTP_201_CREATED)
def create_letter(letter_in: ASLAlphabetReferenceCreate, db: Session = Depends(get_db)):
    existing = db.query(ASLAlphabetReferenceModel).filter(ASLAlphabetReferenceModel.letter == letter_in.letter).first()
    if existing:
        raise HTTPException(status_code=400, detail="Letter already exists")
    
    new_letter = ASLAlphabetReferenceModel(
        letter=letter_in.letter,
        image_url=letter_in.image_url,
        description=letter_in.description,
        tutorial_tips=letter_in.tutorial_tips
    )
    db.add(new_letter)
    db.commit()
    db.refresh(new_letter)
    return new_letter

@router.put("/{letter}", response_model=ASLAlphabetReference)
def update_letter(letter: str, letter_in: ASLAlphabetReferenceCreate, db: Session = Depends(get_db)):
    letter_obj = db.query(ASLAlphabetReferenceModel).filter(ASLAlphabetReferenceModel.letter == letter).first()
    if not letter_obj:
        raise HTTPException(status_code=404, detail="Letter not found")

    letter_obj.image_url = letter_in.image_url
    letter_obj.description = letter_in.description
    letter_obj.tutorial_tips = letter_in.tutorial_tips

    db.commit()
    db.refresh(letter_obj)
    return letter_obj

@router.delete("/{letter}", status_code=status.HTTP_204_NO_CONTENT)
def delete_letter(letter: str, db: Session = Depends(get_db)):
    letter_obj = db.query(ASLAlphabetReferenceModel).filter(ASLAlphabetReferenceModel.letter == letter).first()
    if not letter_obj:
        raise HTTPException(status_code=404, detail="Letter not found")
    db.delete(letter_obj)
    db.commit()
    return
