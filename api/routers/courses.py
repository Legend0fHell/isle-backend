from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from api.models.question import (
    CourseCreate, CourseRead, CourseUpdate,
    CourseLessonCreate, CourseLessonRead,
)
from api.database import get_db
import api.crud.question as crud

router = APIRouter(prefix="/api", tags=["Courses"])

# Course endpoints
@router.post("/course-create/")
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    course_data = crud.create_course(db, course)
    if course_data is None:
        return {"msg": "Course create failed", "data": None}
    
    return {"msg": "Course created", "data": course_data}

@router.get("/course")
def get_course(course_id: UUID, db: Session = Depends(get_db)):
    course_data = crud.get_course(db, course_id)
    if course_data is None:
        return {"msg": "Course not found", "data": None}
    return {"msg": "Get course", "data": course_data}

@router.get("/course/list/")
def get_all_courses(db: Session = Depends(get_db)):
    return crud.get_all_courses(db)

@router.put("/course/update")
def update_course(course: CourseUpdate, db: Session = Depends(get_db)):
    course_data = crud.update_course(db, course)
    if course_data is None: 
        return {"msg": "Course not found", "data": None}
    
    return {"msg": "Course updated", "data": course_data}

@router.delete("/course/delete")
def delete_course(course_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Course deleted", "data": crud.delete_course(db, course_id)}

@router.get("/course/{course_id}/lesson")
def get_lessons_in_course(course_id: UUID, db: Session = Depends(get_db)):
    lessons = crud.get_lesson_by_course(db, course_id)
    
    if lessons is None:
        return {"msg": f"No lessons found in course {course_id}", "data": None}
    
    return {"msg": "Get lessons from course", "data": lessons}

# CourseLesson endpoints
@router.post("/course-lesson/create")
def create_course_lesson(cl: CourseLessonCreate, db: Session = Depends(get_db)):
    course_lesson = crud.create_course_lesson(db, cl)
    
    if course_lesson is None:
        return {"msg": "Course lesson create failed", "data": None}
    
    return {"msg": "Course lesson created", "data": course_lesson}


@router.get("/course/course-lesson")
def get_course_lessons(course_id: UUID, db: Session = Depends(get_db)):
    course_lesson = crud.get_course_lessons(db, course_id)
    if course_lesson is None:
        return {"msg": "Course lesson not found", "data": None}
    
    return {"msg": "Get course lessons by course id", "data": course_lesson}


@router.delete("/course/lesson/delete")
def delete_course_lesson(course_id: UUID, lesson_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Lesson removed from course", "data": crud.delete_course_lesson(db, course_id, lesson_id)}
