import sys 
import os 

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.question import Question, LessonQuestion 
from models.alphabet import ASLCharacter 
from models.user import User, UserLessonProgress, UserQuestionAnswer
from database import Base, engine




print("Creating all tables if not exist...")
Base.metadata.create_all(bind=engine)
print("Done.")