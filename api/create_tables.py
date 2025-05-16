import sys 
import os 

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.database import Base, engine

from api.models.detected_sign import DetectedSign
from api.models.alphabet import ASLAlphabetReference 
from api.models.user import User
from api.models.auto_suggest import AutoSuggest, Quickfix 
from api.models.question import Question, InputQuestion, ChoiceQuestion
from api.models.course import Course, UserCourseEnrollment
from api.models.practice_session import PracticeSession



print("Creating all tables if not exist...")
Base.metadata.create_all(bind=engine)
print("Done.")