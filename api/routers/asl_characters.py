from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from api.models.alphabet import ASLCreate, ASLRead
from api.database import get_db
from api.crud import reference as crud

router = APIRouter(prefix="/asl", tags=["ASL Characters"])


@router.get("/", response_model=List[ASLRead])
def get_all_asl_letters(db: Session = Depends(get_db)):
    return crud.get_all_letters(db)


@router.get("/{letter}", response_model=ASLRead)
def get_asl_letter(letter: str, db: Session = Depends(get_db)):
    return crud.get_letter(db, letter.upper())


@router.post("/", response_model=ASLRead, status_code=status.HTTP_201_CREATED)
def create_asl_letter(asl_data: ASLCreate, db: Session = Depends(get_db)):
    return crud.create_letter(db, asl_data)


@router.put("/update", response_model=ASLRead)
def update_asl_letter(asl_data: ASLCreate, db: Session = Depends(get_db)):
    return crud.update_letter(db, asl_data)


@router.delete("/delete/{letter}")
def delete_asl_letter(letter: str, db: Session = Depends(get_db)):
    return crud.delete_letter(db, letter.upper())
