from sqlalchemy.orm import Session, joinedload
from api.models.question import Question, ChoiceQuestion, InputQuestion
from api.schemas.question import (
    QuestionCreate, QuestionRead,
    ChoiceQuestionCreate, InputQuestionCreate
)
import uuid


def create_question(db: Session, question_data: QuestionCreate) -> Question:
    # Tạo câu hỏi gốc (main question)
    question_id = str(uuid.uuid4())
    db_question = Question(
        question_id=question_id,
        course_id=str(question_data.course_id),
        question_type=question_data.question_type,
        question_order=question_data.question_order
    )
    db.add(db_question)

    # making questions
    if question_data.choice_question:
        choice_data: ChoiceQuestionCreate = question_data.choice_question
        db_choice = ChoiceQuestion(
            question_id=question_id,
            image_url=choice_data.image_url,
            correct_answer=choice_data.correct_answer,
            options=choice_data.options
        )
        db.add(db_choice)

    elif question_data.input_question:
        input_data: InputQuestionCreate = question_data.input_question
        db_input = InputQuestion(
            question_id=question_id,
            target_text=input_data.target_text,
            text_type=input_data.text_type
        )
        db.add(db_input)

    db.commit()
    db.refresh(db_question)
    return db_question


def get_question_by_id(db: Session, question_id: str) -> Question:
    return db.query(Question).filter(Question.question_id == question_id).first()


def get_questions_by_course_id(db: Session, course_id: str):
    """
    Retrieve all questions for a given course_id,
    including related choice_question or input_question details.
    """
    questions = (
        db.query(Question)
        .filter(Question.course_id == course_id)
        .options(
            joinedload(Question.choice_question),
            joinedload(Question.input_question)
        )
        .order_by(Question.question_order)
        .all()
    )
    return questions

def get_all_questions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Question).offset(skip).limit(limit).all()


def delete_question(db: Session, question_id: str) -> bool:
    question = db.query(Question).filter(Question.question_id == question_id).first()
    if not question:
        return False

    db.delete(question)
    db.commit()
    return True
