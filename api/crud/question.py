from sqlalchemy.orm import Session

from api.models.question import Question, Course, Lesson
from api.models.question import CourseLesson, LessonQuestion

from api.models.question import QuestionCreate, QuestionRead, QuestionDelete, QuestionUpdate
from api.models.question import CourseCreate, CourseRead, CourseDelete, CourseUpdate 
from api.models.question import LessonCreate, LessonRead, LessonUpdate, LessonDelete

from api.models.question import CourseLessonCreate, CourseLessonRead, CourseLessonDelete
from api.models.question import LessonQuestionCreate, LessonQuestionRead, LessonQuestionDelete
   
import uuid 
from sqlalchemy.dialects.postgresql import UUID

from fastapi import HTTPException, status

 
##### Course ###### 
"""
class Course(Base):
    course_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_name = Column(String, nullable=False)
    course_desc = Column(Text, nullable=True, default="") # course description
    course_difficulty = Column(Integer, nullable=True, default=0)
    
"""
def create_course(db: Session, course: CourseCreate):
    new_course = Course(
        course_name = course.course_name,
        course_desc = course.course_desc,
        course_difficulty = course.course_difficulty
    )
    
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    
    return new_course


def get_course(db: Session, course_id: UUID):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    
    if not course:
        return None
    
    return course


def get_course_by_name(db: Session, course_name: str):
    course = db.query(Course).filter(Course.course_name == course_name).first()
    
    if not course:
        return None
        
    return course 
    


def update_course(db: Session, course_data: CourseUpdate):
    course = db.query(Course).filter(Course.course_id == course_data.course_id).first()
    
    if not course:
        return None
        
    for field, value in course_data.dict(exclude_unset=True).items():
        setattr(course, field, value)
        
    db.commit()
    db.refresh(course)
    
    return course


def delete_course(db: Session, course_id: UUID):
    # Get the course instance
    course = db.query(Course).filter(Course.course_id == course_id).first()
    
    if not course:
        return None
    
    # Delete related CourseLesson entries
    course_lessons = db.query(CourseLesson).filter(CourseLesson.course_id == course_id).all()
    for cl in course_lessons:
        # Delete related LessonQuestion entries
        lesson_questions = db.query(LessonQuestion).filter(LessonQuestion.lesson_id == cl.lesson_id).all()
        for lq in lesson_questions:
            db.delete(lq)
        db.delete(cl)

    # Delete the course itself
    db.delete(course)
    db.commit()

    return {"detail": f"Course with id {course_id} deleted"}



##### Lesson ##### 
"""
class Lesson(Base):
lesson_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
lesson_name = Column(String, nullable=False)
lesson_desc = Column(Text, nullable=True) # Lesson description
lesson_type = Column(Enum(LessonType), nullable=False)  
"""

def create_lesson(db: Session, lesson: LessonCreate):
    new_lesson = Lesson(
        lesson_name  = lesson.lesson_name,
        lesson_desc = lesson.lesson_desc,
        lesson_type = lesson.lesson_type
    )
    
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    
    return new_lesson

def get_lesson(db: Session, lesson_id: UUID):
    lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_id).first()
    
    if not lesson:
        return None
        
    return lesson

def get_lesson_by_course(db: Session, course_id: UUID):
    course_lessons = db.query(CourseLesson).filter(CourseLesson.course_id == course_id).all()
    
    if not course_lessons:
        return []
    
    lesson_ids = [cl.lesson_id for cl in course_lessons]
    
    lessons = db.query(Lesson).filter(Lesson.lesson_id.in_(lesson_ids)).all()
    
    return lessons


def update_lesson(db: Session, lesson_data: LessonUpdate):
    lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_data.lesson_id).first()
    
    if not lesson:
        return None
    for field, value in lesson_data.dict(exclude_unset=True).items():
        setattr(lesson, field, value)
    db.commit()
    db.refresh(lesson)
    return lesson


def delete_lesson(db: Session, lesson_id: UUID):
    lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_id).first()
    if not lesson:
        return None
        
    lesson_questions = db.query(LessonQuestion).filter(LessonQuestion.lesson_id == lesson_id).all()
    
    for lq in lesson_questions:
        db.delete(lq)
        
    db.delete(lesson)
    db.commit()
    
    return f"Lesson with id {lesson_id} deleted successfully"


##### Question ##### 

"""
class Question(Base):
    __tablename__ = 'questions'

    question_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    question_type = Column(Enum(QuestionType), nullable=False)
    
    # Đáp án đúng của câu hỏi
    question_target = Column(String, nullable=False)  # có thể là 1 ký tự hoặc cụm từ
    
    # Lựa chọn trong câu hỏi, tối đa 4 ký tự ứng với 4 lựa chọn
    question_choice = Column(String(4), nullable=True)  # nullable vì không phải lúc nào cũng cần
"""

def create_question(db: Session, question: QuestionCreate):
    new_question = Question(
        question_type = question.question_type,
        question_target = question.question_target,
        question_choice = question.question_choice
    )
    
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    
    return new_question

def get_question(db: Session, question_id: UUID):
    question = db.query(Question).filter(Question.question_id == question_id).first()
    
    if not question:
        return None
        
    return question
        
def get_question_by_lesson(db: Session, lesson_id: UUID):
    lesson_questions = db.query(LessonQuestion).filter(LessonQuestion.lesson_id == lesson_id).order_by(LessonQuestion.index_in_lesson).all()
    
    if not lesson_questions:
        return None
    
    question_ids = [lq.question_id for lq in lesson_questions]
    
    questions = db.query(Question).filter(Question.question_id.in_(question_ids)).all()
    results = []
    for question in questions:
        results.append({
            "question_id": question.question_id,
            "question_type": question.question_type,
            "question_choice": question.question_choice
        })
    return results

def update_question(db: Session, question_data: QuestionUpdate):
    question = db.query(Question).filter(Question.question_id == question_data.question_id).first()
    
    if not question:
        return None
        
    for field, value in question_data.dict(exclude_unset=True).items():
        setattr(question, field, value)
    db.commit()
    db.refresh(question)
    return question

def delete_question(db: Session, question_id: UUID):
    question = db.query(Question).filter(Question.question_id == question_id).first()
    
    if not question:
        return None
        
    lesson_questions = db.query(LessonQuestion).filter(LessonQuestion.question_id == question_id).all()
    for lq in lesson_questions:
        db.delete(lq)
    
    db.delete(question)
    db.commit()
    
    return question


##### CourseLesson ##### 
""" 
class CourseLesson(Base):
    __tablename__ = "course_lessons"
    cl_entries_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.course_id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.lesson_id"), nullable=False)
    index_in_course = Column(Integer, nullable=False)
"""

def create_course_lesson(db: Session, cl: CourseLessonCreate):
    course = db.query(Course).filter(Course.course_id == cl.course_id).first()
    
    if not course:
        return None
    
    lesson = db.query(Lesson).filter(Lesson.lesson_id == cl.lesson_id).first()
    
    if not lesson:
        return None
    
    # Count current lessons in the course
    existing_lessons = db.query(CourseLesson).filter(CourseLesson.course_id == cl.course_id).all()
    total_lessons = len(existing_lessons)

    # Determine the index: if not provided or invalid, append to the end
    if cl.index_in_course is None or cl.index_in_course < 0 or cl.index_in_course > total_lessons:
        index_to_use = total_lessons
    else:
        # Shift lessons forward starting at the given index
        index_to_use = cl.index_in_course
        for lesson in sorted(existing_lessons, key=lambda x: x.index_in_course, reverse=True):
            if lesson.index_in_course >= index_to_use:
                lesson.index_in_course += 1
        db.flush()  # Ensure index shifts are updated in DB before insert

    # Create the CourseLesson entry
    new_course_lesson = CourseLesson(
        course_id=cl.course_id,
        lesson_id=cl.lesson_id,
        index_in_course=index_to_use
    )

    db.add(new_course_lesson)
    db.commit()
    db.refresh(new_course_lesson)

    return new_course_lesson


def get_course_lessons(db: Session, course_id: UUID):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    
    if not course:
        return None
    
    course_lessons = db.query(CourseLesson).filter(CourseLesson.course_id == course_id).order_by(CourseLesson.index_in_course).all()
    
    if not course_lessons:
        return []
    
        
    return course_lessons

def delete_course_lesson(db: Session, course_id: UUID, lesson_id: UUID):
    cl = db.query(CourseLesson).filter(
        CourseLesson.course_id == course_id,
        CourseLesson.lesson_id == lesson_id
    ).first()
    
    if not cl:
        return None
        
    db.delete(cl)
    db.commit()
    
    return f"Lesson with id {lesson_id} is removed from Course {course_id}"


##### LessonQuestion ##### 
""" 
class LessonQuestion(Base):
    __tablename__ = "lesson_questions" 
    lq_entries_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lesson_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.question_id"), nullable=False)
    index_in_lesson = Column(Integer, nullable=False)
"""

def create_lesson_question(db: Session, lesson_question: LessonQuestionCreate):
    lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_question.lesson_id).first()
    
    if not lesson:
        return None
        
    question = db.query(Question).filter(Question.question_id == lesson_question.question_id).first()
    
    if not question:
        return None
    
    # Get existing questions in this lesson
    existing_questions = db.query(LessonQuestion).filter(
        LessonQuestion.lesson_id == lesson_question.lesson_id
    ).all()
    
    total_questions = len(existing_questions)

    # Determine the index to insert at
    if lesson_question.index_in_lesson is None or lesson_question.index_in_lesson < 0 or lesson_question.index_in_lesson > total_questions:
        index_to_use = total_questions
    else:
        index_to_use = lesson_question.index_in_lesson
        # Shift existing questions forward if needed
        for q in sorted(existing_questions, key=lambda x: x.index_in_lesson, reverse=True):
            if q.index_in_lesson >= index_to_use:
                q.index_in_lesson += 1
        db.flush()  # Apply updates before inserting the new one

    # Create new LessonQuestion
    new_lesson_question = LessonQuestion(
        lesson_id=lesson_question.lesson_id,
        question_id=lesson_question.question_id,
        index_in_lesson=index_to_use
    )

    db.add(new_lesson_question)
    db.commit()
    db.refresh(new_lesson_question)

    return new_lesson_question


def get_lesson_questions(db: Session, lesson_id: UUID):
    # Check if the lesson exists
    lesson = db.query(Lesson).filter(Lesson.lesson_id == lesson_id).first()
    
    if not lesson:
        return None
        
    # Get all questions in the lesson
    lesson_questions = db.query(LessonQuestion).filter(
        LessonQuestion.lesson_id == lesson_id
    ).order_by(LessonQuestion.index_in_lesson).all()
    
    if not lesson_questions:
        return []
    
    return lesson_questions


def delete_lesson_questions(db: Session, lesson_id: UUID, question_id: UUID):
    lq = db.query(LessonQuestion).filter(
        LessonQuestion.lesson_id == lesson_id,
        LessonQuestion.question_id == question_id).first()
    
    if not lq:
        return None
        
    db.delete(lq)
    db.commit()
    
    return f"Question with id {question_id} is removed from lesson {lesson_id}"

 


""" 
Get all courses 
"""
def get_all_courses(db: Session):
    courses = db.query(Course).all()
    
    if not courses:
        return {
            "msg": "No courses found",
            "data": []
        }
    
    result = []
    for course in courses:
        # Get all CourseLesson entries for this course, ordered by index_in_course
        course_lessons = (
            db.query(CourseLesson)
            .filter(CourseLesson.course_id == course.course_id)
            .order_by(CourseLesson.index_in_course)
            .all()
        )
        
        lessons_list = []
        for cl in course_lessons:
            # Get the Lesson info for each associated lesson_id
            lesson = db.query(Lesson).filter(Lesson.lesson_id == cl.lesson_id).first()
            if lesson:
                # Count questions linked to this lesson, assuming LessonQuestion links Lesson & Question
                lesson_num_question = (
                    db.query(LessonQuestion)
                    .filter(LessonQuestion.lesson_id == lesson.lesson_id)
                    .count()
                )
                
                lessons_list.append({
                    "lesson_id": str(lesson.lesson_id),
                    "lesson_name": lesson.lesson_name,
                    "lesson_desc": lesson.lesson_desc,
                    "lesson_type": lesson.lesson_type,
                    "lesson_num_question": lesson_num_question,
                })
        
        result.append({
            "course_id": str(course.course_id),
            "course_name": course.course_name,
            "course_desc": course.course_desc,
            "course_difficulty": course.course_difficulty,
            "course_lessons": lessons_list,
        })
    
    return {
        "msg": "success",
        "data": result,
    }
