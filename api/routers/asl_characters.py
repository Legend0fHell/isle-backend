from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from api.models.alphabet import ASLCreate, ASLRead
from api.database import get_db
from api.crud import reference as crud

router = APIRouter(prefix="/asl", tags=["ASL Characters"])


@router.get("/all/")
def get_all_asl_letters(db: Session = Depends(get_db)):
    return {
        "msg": "Get all asl letters",
        "data": crud.get_all_letters(db)
    }


@router.get("/{letter}/info")
def get_asl_letter(letter: str, db: Session = Depends(get_db)):
    return {
        "msg": "Get asl letter info",
        "data": crud.get_letter(db, letter.upper().strip())
    }


@router.post("/create/")
def create_asl_letter(asl_data: ASLCreate, db: Session = Depends(get_db)):
    return {
        "msg": "Create new asl letter",
        "data": crud.create_letter(db, asl_data)
    }


@router.put("/update")
def update_asl_letter(asl_data: ASLCreate, db: Session = Depends(get_db)):
    return {
        "msg": "Update asl letter",
        "data": crud.update_letter(db, asl_data)
    }


@router.delete("/delete/{letter}")
def delete_asl_letter(letter: str, db: Session = Depends(get_db)):
    return {
        "msg": "Delete asl letter",
        "data": crud.delete_letter(db, letter.upper().strip())
    }

