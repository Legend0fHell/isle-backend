from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from models.question import (
    CourseCreate, CourseRead, CourseUpdate,
    CourseLessonCreate, CourseLessonRead,
)
from database import get_db
import crud.question as crud

router = APIRouter(prefix="/course", tags=["Courses"])

# Course endpoints
@router.post("/create/")
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    course_data = crud.create_course(db, course)
    if course_data is None:
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": course_data}

@router.post("/course")
def get_course(course_id: UUID, db: Session = Depends(get_db)):
    course_data = crud.get_course(db, course_id)
    if course_data is None:
        return {"msg": "error", "data": None}
    return {"msg": "ok", "data": course_data}

@router.post("/list/")
def get_all_courses(db: Session = Depends(get_db)):
    return crud.get_all_courses(db)

@router.put("/update")
def update_course(course: CourseUpdate, db: Session = Depends(get_db)):
    course_data = crud.update_course(db, course)
    if course_data is None: 
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": course_data}

@router.delete("/delete")
def delete_course(course_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Course deleted", "data": crud.delete_course(db, course_id)}

@router.post("/{course_id}/lesson")
def get_lessons_in_course(course_id: UUID, db: Session = Depends(get_db)):
    lessons = crud.get_lesson_by_course(db, course_id)
    
    if lessons is None:
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": lessons}

# CourseLesson endpoints
@router.post("/course-lesson/create")
def create_course_lesson(cl: CourseLessonCreate, db: Session = Depends(get_db)):
    course_lesson = crud.create_course_lesson(db, cl)
    
    if course_lesson is None:
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": course_lesson}


@router.post("/course-lesson")
def get_course_lessons(course_id: UUID, db: Session = Depends(get_db)):
    course_lesson = crud.get_course_lessons(db, course_id)
    if course_lesson is None:
        return {"msg": "error", "data": None}
    
    return {"msg": "ok", "data": course_lesson}


@router.delete("/lesson/delete")
def delete_course_lesson(course_id: UUID, lesson_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "ok", "data": crud.delete_course_lesson(db, course_id, lesson_id)}
