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
    return {"msg": "Course created", "data": crud.create_course(db, course)}

@router.get("/course/{course_id}")
def get_course(course_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Get course", "data": crud.get_course(db, course_id)}

@router.get("/course/list/")
def get_all_courses(db: Session = Depends(get_db)):
    return crud.get_all_courses(db)

@router.put("/course/update")
def update_course(course: CourseUpdate, db: Session = Depends(get_db)):
    return {"msg": "Course updated", "data": crud.update_course(db, course)}

@router.delete("/course/delete/{course_id}")
def delete_course(course_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Course deleted", "data": crud.delete_course(db, course_id)}

@router.get("/course/{course_id}/lesson")
def get_lessons_in_course(course_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Get lessons from course", "data": crud.get_lesson_by_course(db, course_id)}

# CourseLesson endpoints
@router.post("/course-lesson/create")
def create_course_lesson(cl: CourseLessonCreate, db: Session = Depends(get_db)):
    return {"msg": "Course lesson created", "data": crud.create_course_lesson(db, cl)}

@router.get("/course/{course_id}/course-lesson")
def get_course_lessons(course_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Get course lessons by course id", "data": crud.get_course_lessons(db, course_id)}

@router.delete("/course/{course_id}/lesson/{lesson_id}/delete")
def delete_course_lesson(course_id: UUID, lesson_id: UUID, db: Session = Depends(get_db)):
    return {"msg": "Lesson removed from course", "data": crud.delete_course_lesson(db, course_id, lesson_id)}
