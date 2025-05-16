# routers/user_course.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.schemas.course import UserCourseEnrollment, UserCourseEnrollmentBase
from app.crud import user_course_enrollment 
from app.database import get_db

router = APIRouter(
    prefix="/user-course",
    tags=["user_course"]
)

@router.post("/", response_model=UserCourseEnrollmentBase, status_code=status.HTTP_201_CREATED)
def enroll_user(enrollment: UserCourseEnrollment, db: Session = Depends(get_db)):
    # Check if already enrolled
    existing = db.query(user_course_enrollment.UserCourseEnrollment).filter(
        user_course_enrollment.UserCourseEnrollment.user_id == enrollment.user_id,
        user_course_enrollment.UserCourseEnrollment.course_id == enrollment.course_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already enrolled in this course")
    
    new_enrollment = user_course_enrollment.enroll_user_in_course(db, enrollment.user_id, enrollment.course_id)
    return new_enrollment

@router.get("/user/{user_id}", response_model=List[UserCourseEnrollmentBase])
def get_user_courses(user_id: UUID, db: Session = Depends(get_db)):
    courses = user_course_enrollment.get_user_courses(db, str(user_id))
    return courses

@router.patch("/{enrollment_id}", response_model=UserCourseEnrollmentBase)
def update_progress(enrollment_id: UUID, progress: float, completed: bool = False, db: Session = Depends(get_db)):
    enrollment = user_course_enrollment.update_course_progress(db, str(enrollment_id), progress, completed)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment

@router.delete("/{enrollment_id}", response_model=UserCourseEnrollmentBase)
def unenroll(enrollment_id: UUID, db: Session = Depends(get_db)):
    enrollment = user_course_enrollment.unenroll_user(db, str(enrollment_id))
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment
