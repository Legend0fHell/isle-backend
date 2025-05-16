from sqlalchemy.orm import Session
from api.models.course import Course
from api.schemas.course import CourseCreate
import uuid
from datetime import datetime

def get_course(db: Session, course_id: str):
    return db.query(Course).filter(Course.course_id == course_id).first()

def get_course_by_name(db: Session, course_name: str):
    return db.query(Course).filter(Course.name == course_name).first()

def get_courses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Course).offset(skip).limit(limit).all()

def create_course(db: Session, course: CourseCreate):
    db_course = Course(
        course_id=str(uuid.uuid4()),
        name=course.name,
        description=course.description,
        difficulty_level=course.difficulty_level,
        created_at=datetime.utcnow(),
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course


def delete_course(db: Session, course_id: str):
    db_course = get_course(db, course_id)
    if db_course:
        db.delete(db_course)
        db.commit()
    return db_course


def update_course(db: Session, course_id: str, course_update: CourseCreate):
    db_course = get_course(db, course_id)
    if not db_course:
        return None
    db_course.name = course_update.name
    db_course.description = course_update.description
    db_course.difficulty_level = course_update.difficulty_level
    db.commit()
    db.refresh(db_course)
    return db_course