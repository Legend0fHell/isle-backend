from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from api.models.alphabet import ASLCreate, ASLRead
from api.database import get_db
from api.crud import reference as crud

router = APIRouter(prefix="/asl", tags=["ASL Characters"])

# --- ASL Characters Endpoints --- #

@router.get("/all/")
def get_all_asl_letters(db: Session = Depends(get_db)):
    """
    Retrieve all ASL letters.
    """
    return {
        "msg": "Get all ASL letters",
        "data": crud.get_all_letters(db)
    }

@router.get("/{letter}/info")
def get_asl_letter(letter: str, db: Session = Depends(get_db)):
    """
    Retrieve details of a specific ASL letter (case-insensitive).
    """
    letter_clean = letter.upper().strip()
    return {
        "msg": f"Get ASL letter info for '{letter_clean}'",
        "data": crud.get_letter(db, letter_clean)
    }

@router.post("/create/")
def create_asl_letter(asl_data: ASLCreate, db: Session = Depends(get_db)):
    """
    Create a new ASL letter entry.
    """
    return {
        "msg": "Create new ASL letter",
        "data": crud.create_letter(db, asl_data)
    }

@router.put("/update")
def update_asl_letter(asl_data: ASLCreate, db: Session = Depends(get_db)):
    """
    Update an existing ASL letter entry.
    """
    return {
        "msg": "Update ASL letter",
        "data": crud.update_letter(db, asl_data)
    }

@router.delete("/delete/{letter}")
def delete_asl_letter(letter: str, db: Session = Depends(get_db)):
    """
    Delete an ASL letter entry by letter (case-insensitive).
    """
    letter_clean = letter.upper().strip()
    return {
        "msg": f"Delete ASL letter '{letter_clean}'",
        "data": crud.delete_letter(db, letter_clean)
    }
