# crud/user_course.py
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime
from api.models.course import UserCourseEnrollment

def enroll_user_in_course(db: Session, user_id: str, course_id: str):
    enrollment = UserCourseEnrollment(
        enrollment_id=uuid4(),
        user_id=user_id,
        course_id=course_id,
        enrolled_at=datetime.utcnow(),
        completed_at=None,
        progress=0.0
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment

def get_user_courses(db: Session, user_id: str):
    return db.query(UserCourseEnrollment).filter(UserCourseEnrollment.user_id == user_id).all()

def update_course_progress(db: Session, enrollment_id: str, progress: float, completed: bool = False):
    enrollment = db.query(UserCourseEnrollment).filter(UserCourseEnrollment.enrollment_id == enrollment_id).first()
    if not enrollment:
        return None
    enrollment.progress = progress
    if completed:
        enrollment.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(enrollment)
    return enrollment

def unenroll_user(db: Session, enrollment_id: str):
    enrollment = db.query(UserCourseEnrollment).filter(UserCourseEnrollment.enrollment_id == enrollment_id).first()
    if enrollment:
        db.delete(enrollment)
        db.commit()
    return enrollment
