from sqlalchemy import Column, Text 
from api.database import Base 

class ASLAlphabetReference(Base):
    __tablename__ = "asl_alphabet_reference"
    
    letter = Column(Text, primary_key=True)
    image_url = Column(Text, nullable=False)
    description = Column(Text, nullable=False, default="")
    tutorial_tips = Column(Text, nullable=False, default="")
    
    def __repr__(self):
        return f"<ASLAlphabetReference(letter='{self.letter}', image_url='{self.image_url}')>"