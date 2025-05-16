import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from api.schemas.user import UserCreate, UserLogin, UserRead
from api.crud import user


from api.database import get_db


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# -----------------------------
# POST /users/signup
# -----------------------------
@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    db_user = user.get_user_by_username(db, username=user_data.user_name)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    return user.create_user(db, user_data)


# -----------------------------
# POST /users/login
# -----------------------------
@router.post("/login", response_model=UserRead)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    db_user = user.authenticate_user(db, user_credentials)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    return db_user



# -----------------------------
# GET /users/
# -----------------------------
@router.get("/", response_model=List[UserRead])
def get_all_users(db: Session = Depends(get_db)):
    return user.get_all_users(db)