from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from models.alphabet import ASLCreate, ASLRead
from database import get_db
from crud import reference as crud

router = APIRouter(prefix="/asl", tags=["ASL Characters"])

# --- ASL Characters Endpoints --- #

@router.post("/")
def get_all_asl_letters(db: Session = Depends(get_db)):
    """
    Retrieve all ASL letters.
    """
    return {
        "msg": "ok",
        "data": crud.get_all_letters(db)
    }

@router.post("/info")
def get_asl_letter(letter: str, db: Session = Depends(get_db)):
    """
    Retrieve details of a specific ASL letter (case-insensitive).
    """
    letter_clean = letter.upper().strip()
    letter_data = crud.get_letter(db, letter_clean)
    if letter_data is None:
        return {"msg": "error", "data": None}
    return {
        "msg": "ok",
        "data": crud.get_letter(db, letter_clean)
    }

@router.post("/create")
def create_asl_letter(asl_data: ASLCreate, db: Session = Depends(get_db)):
    """
    Create a new ASL letter entry.
    """
    letter_data = crud.create_letter(db, asl_data)
    if letter_data is None:
        return {
            "msg": "error",
            "data": None 
        }
    
    return {
        "msg": "ok",
        "data": letter_data
    }

@router.put("/update")
def update_asl_letter(asl_data: ASLCreate, db: Session = Depends(get_db)):
    """
    Update an existing ASL letter entry.
    """
    return {
        "msg": "ok",
        "data": crud.update_letter(db, asl_data)
    }

@router.delete("/delete")
def delete_asl_letter(letter: str, db: Session = Depends(get_db)):
    """
    Delete an ASL letter entry by letter (case-insensitive).
    """
    letter_clean = letter.upper().strip()
    return {
        "msg": "ok",
        "data": crud.delete_letter(db, letter_clean)
    }
