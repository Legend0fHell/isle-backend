from fastapi import APIRouter, Depends,Body
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from models.question import (
    CourseCreate, CourseUpdate,
    CourseLessonCreate
)
from database import get_db
import crud.question as crud

router = APIRouter(prefix="/course", tags=["Courses"])

# Course endpoints
@router.post("/")
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    course_data = crud.create_course(db, course)
    if course_data is None:
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": course_data}

@router.get("/list")
def get_all_courses(db: Session = Depends(get_db)):
    return crud.get_all_courses(db)

@router.get("/{course_id}")
def get_course(course_id: UUID, db: Session = Depends(get_db)):
    course_data = crud.get_course(db, course_id)
    if course_data is None:
        return {"msg": "error", "data": None}
    return {"msg": "ok", "data": course_data}

@router.put("/update")
def update_course(course: CourseUpdate, db: Session = Depends(get_db)):
    course_data = crud.update_course(db, course)
    if course_data is None: 
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": course_data}

@router.delete("/delete/{course_id}")
def delete_course(course_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Course deleted", "data": crud.delete_course(db, course_id)}


@router.get("/{course_id}/lesson")
def get_lessons_in_course(course_id: UUID, db: Session = Depends(get_db)):
    lessons = crud.get_lesson_by_course(db, course_id)
    
    if lessons is None:
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": lessons}

# CourseLesson endpoints
@router.post("/lesson-link")
def add_lesson_to_course(course_id: UUID = Body(..., embed=True), lesson_id: UUID = Body(..., embed=True), db: Session = Depends(get_db)):
    course_lesson = crud.create_course_lesson(db, CourseLessonCreate(course_id=course_id, lesson_id=lesson_id))
    
    if course_lesson is None:
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": course_lesson}


@router.delete("/{course_id}/lesson/{lesson_id}")
def remove_lesson_from_course(course_id: UUID, lesson_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "ok", "data": crud.delete_course_lesson(db, course_id, lesson_id)}
