import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from api.models.user import User
from api.models.user import UserCreate, UserLogin, UserUpdate



# --- Helper Functions --- #

def get_user_by_field(db: Session, field: str, value: str):
    if field == "email":
        return db.query(User).filter(User.email == value).first()
    elif field == "username":
        return db.query(User).filter(User.name == value).first()
    elif field == "id":
        return db.query(User).filter(User.user_id == value).first()
    raise ValueError("Invalid user field")

# --- Core CRUD Logic --- #

def get_user(db: Session, user_id: str):
    return get_user_by_field(db, "id", user_id)

def get_user_by_email(db: Session, email: str):
    return get_user_by_field(db, "email", email)

def get_user_by_username(db: Session, username: str):
    return get_user_by_field(db, "username", username)

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user_data: UserCreate):
    if get_user_by_email(db, user_data.email):
        return None
    
    new_user = User(
        user_id=str(uuid.uuid4()),
        email=user_data.email,
        name=user_data.name,
        password=user_data.password,
        created_at=datetime.utcnow(),
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return None
    db.refresh(new_user)
    return new_user

def update_user(db: Session, user_data: UserUpdate):
    user = db.query(User).filter(User.user_id == user_data.user_id).first()
    if not user:
        return None
   
   
    for field, value in user_data.dict(exclude_unset=True).items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return user
        
    


def authenticate_user(db: Session, login_data: UserLogin):
    user = get_user_by_email(db, login_data.email)
    if user and login_data.password == user.password:
        return user
    return None

def delete_user(db: Session, user_id: str):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def get_all_users(db: Session):
    return db.query(User).all()
