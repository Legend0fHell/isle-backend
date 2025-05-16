from sqlalchemy.orm import Session
from api.models.user import User
from api.schemas.user import UserCreate, UserLogin
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
import uuid
from datetime import datetime


# Lấy user theo ID
def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.user_id == user_id).first()


# Lấy user theo email
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


# Lấy user theo username
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.user_name == username).first()


# Lấy nhiều user (có phân trang)
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


# Tạo user mới
def create_user(db: Session, user_data: UserCreate):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    new_user = User(
        user_id=uuid.uuid4(),
        email=user_data.email,
        user_name=user_data.user_name,
        password=user_data.password, 
        created_at=datetime.utcnow(),
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered (race condition)"
        )
    db.refresh(new_user)
    return new_user


# Xác thực user đăng nhập
"""
# Schema to login
class UserLogin(BaseModel):
    email: EmailStr
    password: str 
"""
def authenticate_user(db: Session, login_data: UserLogin):
    user = get_user_by_email(db, login_data.email)
    if user and user.password == login_data.password:
        return user
    return None


# Xoá user
def delete_user(db: Session, user_id: str):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user


# Lấy tất cả user
def get_all_users(db: Session):
    return db.query(User).all()
