from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from api.database import get_db
from api.models.user import UserCreate, UserLogin, UserUpdate, BaseResponse, UserData
from api.crud import user as user_crud

router = APIRouter(
    prefix="/api/user",
    tags=["Users"]
)

# ----------------------------
# Create a new user (registration)
# ----------------------------
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    created_user = user_crud.create_user(db, user)
    if not created_user:
        return {
            "msg": "error",
            "data": None
        }
    return {
        "msg": "ok",
        "data": created_user
    }

# ----------------------------
# Retrieve user by ID
# ----------------------------
@router.get("/info")
def read_user(user_id: UUID, db: Session = Depends(get_db)):
    """
    Get user information by user ID.
    """
    db_user = user_crud.get_user(db, user_id)
    if db_user is None:
        return {"msg": "error", "data": None}
    return {"msg": "ok", "data": UserData.from_orm(db_user)}

# ----------------------------
# Login user with credentials
# ----------------------------
@router.post("/login")
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user credentials and return user info if valid.
    """
    user = user_crud.authenticate_user(db, credentials)
    if not user:
        return {"msg": "error", "data": None}
    return {"msg": "ok", "data": UserData.from_orm(user)}

# ----------------------------
# Retrieve a list of users (pagination support)
# ----------------------------
@router.get("/list", response_model=dict)
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a paginated list of users.
    """
    users = user_crud.get_users(db, skip=skip, limit=limit)
    return {
        "msg": "ok",
        "data": [UserData.from_orm(user) for user in users]
    }
