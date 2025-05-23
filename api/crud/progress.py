from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from datetime import datetime

from models.user import UserLessonProgress, User
from models.user import LessonProgressCreate, UserAnswerSubmit, UserQuestionAnswer, UserAnswerCreate

from models.question import Question, Lesson, LessonQuestion


# --- LessonProgress CRUD --- #
""" 
class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"
    
    progress_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.lesson_id"), nullable=False)
    last_activity_at = Column(TIMESTAMP, default=datetime.utcnow)
    correct_questions = Column(Integer, default=0)
    
"""

def start_lesson_progress(db: Session, data: LessonProgressCreate):
    user = db.query(User).filter(User.user_id == data.user_id).first()
    
    if not user:
        return None
        
    lesson = db.query(Lesson).filter(Lesson.lesson_id == data.lesson_id).first()
    
    if not lesson:
        return None
    
    existing = db.query(UserLessonProgress).filter(
        UserLessonProgress.user_id == data.user_id,
        UserLessonProgress.lesson_id == data.lesson_id
    ).first()
    
    if existing:
        return existing

    progress = UserLessonProgress(
        user_id=data.user_id,
        lesson_id=data.lesson_id,
        last_activity_at=datetime.utcnow(),
        correct_questions=0
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return {
        "progress_id": progress.progress_id,
        "user_id": data.user_id,
        "lesson_id": data.lesson_id,
        "last_activity_at": datetime.utcnow(),
        "correct_question": 0
    }


def get_lesson_progress(db: Session, user_id: UUID, lesson_id: UUID):
    progress = db.query(UserLessonProgress).filter(
        UserLessonProgress.user_id == user_id,
        UserLessonProgress.lesson_id == lesson_id
    ).first()
    
    if not progress:
        return None
    
    return progress



def get_lesson_progress_by_user(db: Session, user_id: UUID):
    user = db.query(User).filter(User.user_id == user_id).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_progress = db.query(UserLessonProgress).filter(
        UserLessonProgress.user_id == user_id
    ).all()
     
    return user_progress 
    
    


# --- UserQuestionAnswer CRUD --- #
""" 
class UserQuestionAnswer(Base):
    __tablename__ = "user_question_answers"
    
    progress_id = Column(UUID(as_uuid=True), ForeignKey("user_lesson_progress.progress_id"), primary_key=True)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.question_id"), primary_key=True)
    
    user_choice = Column(String, nullable=True)
    is_correct = Column(BOOLEAN, nullable=True)
    

class UserAnswerCreate(BaseModel):
    user_id: UUID
    question_id: UUID
    
"""

def create_user_question_answer(db: Session, user_data: UserAnswerCreate):
    question = db.query(Question).filter(Question.question_id == user_data.question_id).first()
        
    if not question:
        return None
        
    new_user_answer = UserQuestionAnswer(
        progress_id = user_data.progress_id,
        question_id = user_data.question_id
    )
    
    db.add(new_user_answer)
    db.commit()
    db.refresh(new_user_answer)
    
    return new_user_answer


def get_user_question_answer(db: Session, progress_id: UUID, question_id: UUID):
    answer = db.query(UserQuestionAnswer).filter(
        UserQuestionAnswer.progress_id == progress_id,
        UserQuestionAnswer.question_id == question_id
    ).first()
    
    if not answer:
        return None
    
    return answer

def get_user_question_answers_by_lesson(db: Session, progress_id: UUID):
    answers = db.query(UserQuestionAnswer).filter(UserQuestionAnswer.progress_id == progress_id).all()
    if not answers:
        return {"msg": "error", "data": None}
    results = []
    
    for answer in answers:
        results.append({
            "question_id": answer.question_id,
            "user_choice": answer.user_choice,
            "is_correct": answer.is_correct
        }
        )
        
    
    return {"msg": "ok", "data": results}

    
    
def submit_user_answer(db: Session, data: UserAnswerSubmit):
 
    # Verify answer record exists
    user_answer = db.query(UserQuestionAnswer).filter(
        UserQuestionAnswer.progress_id == data.progress_id,
        UserQuestionAnswer.question_id == data.question_id
    ).first()

    if not user_answer:
        return None

    # Verify question exists
    question = db.query(Question).filter(Question.question_id == data.question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question with id {data.question_id} not found"
        )

    # 4. Check correctness
    is_correct = data.user_choice.strip().lower() == question.question_target.strip().lower()

    # 5. Update user answer
    user_answer.user_choice = data.user_choice
    user_answer.is_correct = is_correct

    # 6. Update lesson progress
    lesson_progress = db.query(UserLessonProgress).filter(
        UserLessonProgress.progress_id == data.progress_id
    ).first()

    if not lesson_progress:
        return None

    if is_correct:
        lesson_progress.correct_questions += 1

    lesson_progress.last_activity_at = datetime.utcnow()

    # 7. Commit changes
    db.commit()
    db.refresh(user_answer)

    return {"msg": "ok", "data": is_correct}


        
""" 
Track user progress 

class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"
    
    progress_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.lesson_id"), nullable=False)
    last_activity_at = Column(TIMESTAMP, default=datetime.utcnow)
    correct_questions = Column(Integer, default=0)
    
    model_config = {
        "arbitrary_types_allowed": True
    }
"""    
def track_user_progress(db: Session, user_id: UUID):
    user = db.query(User).filter(User.user_id == user_id).first()
    
    if not user:
        return {
            "msg": "error",
            "data": None 
        }

    user_progress = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == user_id)
        .order_by(UserLessonProgress.last_activity_at)
        .all()
    )

    progress_list = []
    for progress in user_progress:
        progress_list.append({
            "progress_id": progress.progress_id,
            "lesson_id": progress.lesson_id,
            "last_activity_at": progress.last_activity_at,
            "correct_question": progress.correct_questions
        })

    return {
        "msg": "ok",
        "data": progress_list
    }
    

def get_user_recent_lesson_progress(db: Session, user_id: UUID, lesson_id: UUID):
    lesson_progress = (
        db.query(UserLessonProgress)
        .filter(
            UserLessonProgress.user_id == user_id,
            UserLessonProgress.lesson_id == lesson_id
        )
        .order_by(UserLessonProgress.last_activity_at.desc())  # assume latest
        .first()
    )

    if lesson_progress is None: 
        return {"msg": "error", "data": None}

    question_answers = (
        db.query(UserQuestionAnswer)
        .filter(UserQuestionAnswer.progress_id == lesson_progress.progress_id)
        .all()
    )

    results = [
        {
            "question_id": qa.question_id,
            "user_choice": qa.user_choice,
            "is_correct": qa.is_correct
        }
        for qa in question_answers
    ]

    return {
        "msg": "ok",
        "data": results
    }

    
    
        

    

    