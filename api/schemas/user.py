from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime 
from uuid import UUID
# Schema to create new user (sign up)
class UserCreate(BaseModel):
    email: EmailStr
    user_name: str
    password: str
    
    
# Schema to login
class UserLogin(BaseModel):
    email: EmailStr
    password: str 
    
# Schema to read user data
class UserRead(BaseModel):
    user_id: UUID
    email: EmailStr
    user_name: str 
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        orm_mode = True 
        
    
    
    
    