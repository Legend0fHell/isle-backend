from pydantic import BaseModel


# Schema response: return information about a character
class ASLAlphabetReference(BaseModel):
    letter: str
    image_url: str
    description: str
    tutorial_tips: str

    class Config:
        orm_mode = True


# Optional: Add another character to the database
class ASLAlphabetReferenceCreate(BaseModel):
    letter: str
    image_url: str
    description: str = ""
    tutorial_tips: str = ""
