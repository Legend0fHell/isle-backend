from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from api.models.alphabet import ASLCreate, ASLRead
from api.database import get_db
from api.crud import reference as crud

router = APIRouter(prefix="/api", tags=["ASL Characters"])

# --- ASL Characters Endpoints --- #

@router.get("/asl")
def get_all_asl_letters(db: Session = Depends(get_db)):
    """
    Retrieve all ASL letters.
    """
    return {
        "msg": "ok",
        "data": crud.get_all_letters(db)
    }

@router.get("/asl/info")
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

@router.post("/asl/create")
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

@router.put("/asl/update")
def update_asl_letter(asl_data: ASLCreate, db: Session = Depends(get_db)):
    """
    Update an existing ASL letter entry.
    """
    return {
        "msg": "ok",
        "data": crud.update_letter(db, asl_data)
    }

@router.delete("/asl/delete")
def delete_asl_letter(letter: str, db: Session = Depends(get_db)):
    """
    Delete an ASL letter entry by letter (case-insensitive).
    """
    letter_clean = letter.upper().strip()
    return {
        "msg": "ok",
        "data": crud.delete_letter(db, letter_clean)
    }
