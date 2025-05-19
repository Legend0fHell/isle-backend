from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.database import get_db
from api.models.user import UserCreate, UserLogin, UserUpdate, BaseResponse, UserData
from api.crud import user as user_crud

from uuid import UUID

router = APIRouter(
    prefix="/api/user",
    tags=["Users"]
)



# Get user by ID
@router.get("/{user_id}", response_model=BaseResponse)
def read_user(user_id: UUID, db: Session = Depends(get_db)):
    db_user = user_crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"msg": "User found", "data": UserData.from_orm(db_user)}

# Register new user
@router.post("/register", response_model=BaseResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    user = user_crud.create_user(db, user_data)
    return {"msg": "User created successfully", "data": UserData.from_orm(user)}

# Login user
@router.post("/login", response_model=BaseResponse)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    user = user_crud.authenticate_user(db, credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"msg": "Login successful", "data": UserData.from_orm(user)}

# Get all users (nếu cần trả về danh sách)
@router.get("/list", response_model=dict)
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = user_crud.get_users(db, skip=skip, limit=limit)
    return {
        "msg": "Here comes your users",
        "data": [UserData.from_orm(user) for user in users]
    }
