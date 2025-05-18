from sqlalchemy import Column, String, Text
from api.database import Base 
from pydantic import BaseModel
from typing import Optional


# --- Database tables --- #
class ASLCharacter(Base):
    __tablename__ = "asl_characters"
    
    char_name = Column(String, primary_key=True)
    char_image_url = Column(Text, nullable=False)
    char_tutorial_text = Column(Text, nullable=True)
    char_tutorial_url = Column(Text, nullable=True)  # URL to tutorial video

    def __repr__(self):
        return f"<ASLCharacter(char_name={self.char_name})>"


# --- Pydantic Schemas --- #
class ASLCreate(BaseModel):
    char_name: str
    char_image_url: str 
    char_tutorial_text: Optional[str] = None 
    char_tutorial_url: Optional[str] = None 



class ASLRead(BaseModel):
    char_name: str 
    char_image_url: str 
    char_tutorial_text: Optional[str] = None
    char_tutorial_url: Optional[str] = None

        
class ASLUpdate(BaseModel):
    char_name: str
    char_image_url: Optional[str] = None 
    char_tutorial_text: Optional[str] = None 
    char_tutorial_url: Optional[str] = None 
    
class ASLDelete(BaseModel):
    char_name: str 
    
     
    
