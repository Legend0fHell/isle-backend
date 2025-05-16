import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from api.database import get_db
from api.crud import course 
from api.schemas.course import CourseCreate, CourseUpdate, Course
from uuid import UUID

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)

# Lấy tất cả các khóa học
@router.get("/", response_model=List[Course])
def read_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    courses = course.get_courses(db, skip=skip, limit=limit)
    return courses

# Lấy khóa học theo ID
@router.get("/{course_id}", response_model=Course)
def read_course(course_id: UUID, db: Session = Depends(get_db)):
    db_course = course.get_course(db, course_id=course_id)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course

# Lấy khóa học theo tên khoá học
@router.get("/name/{course_name}", response_model=Course)
def read_course_by_name(course_name: str, db: Session = Depends(get_db)):
    db_course = course.get_course_by_name(db, course_name=course_name)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course
        


# Tạo khóa học mới
@router.post("/", response_model=Course, status_code=status.HTTP_201_CREATED)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    return course.create_course(db, course)

# Cập nhật thông tin khóa học
@router.put("/{course_id}", response_model=Course)
def update_course(course_id: UUID, course_update: CourseUpdate, db: Session = Depends(get_db)):
    updated_course = course.update_course(db, course_id=course_id, course_update=course_update)
    if updated_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return updated_course

# Xoá khóa học
@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: UUID, db: Session = Depends(get_db)):
    deleted_course = course.delete_course(db, course_id=course_id)
    if deleted_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return None
