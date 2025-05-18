from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.database import get_db
from api.models.user import UserCreate, UserLogin, UserRead, UserUpdate
from api.crud import user as user_crud

from uuid import UUID

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# Get all users
@router.get("/", response_model=list[UserRead])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return user_crud.get_users(db, skip=skip, limit=limit)

# Get user by ID
@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: UUID, db: Session = Depends(get_db)):
    db_user = user_crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Register new user
@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    return user_crud.create_user(db, user_data)

# Login user
@router.post("/login", response_model=UserRead)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    user = user_crud.authenticate_user(db, credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    return user

# Update user 
@router.put("/{user_id}", response_model=UserRead)
def update_user(user_id: UUID, user_data: UserUpdate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    for field, value in user_data.dict(exclude_unset=True).items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user

# Delete user
@router.delete("/{user_id}", response_model=UserRead)
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    deleted = user_crud.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return deleted


