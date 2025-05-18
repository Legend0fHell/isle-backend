import sys 
import os 

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.database import Base, engine


from api.models.alphabet import ASLCharacter
from api.models.user import User, UserQuestionAnswer, UserLessonProgress
from api.models.question import Question, Lesson, Course, CourseLesson, LessonQuestion




print("Creating all tables if not exist...")
Base.metadata.create_all(bind=engine)
print("Done.")