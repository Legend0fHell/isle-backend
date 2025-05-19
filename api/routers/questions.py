from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from api.models.question import (
    CourseCreate, CourseRead, CourseUpdate,
    LessonCreate, LessonRead, LessonUpdate,
    QuestionCreate, QuestionRead, QuestionUpdate,
    CourseLessonCreate, CourseLessonRead,
    LessonQuestionCreate, LessonQuestionRead,
)

from api.database import get_db
import api.crud.question as crud

router = APIRouter(prefix="/api", tags=["Questions"])


##### Course Endpoints #####
@router.post("/course-create/")
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    return {
        "msg": "Course create",
        "data": crud.create_course(db, course)
    }

@router.get("/course/{course_id}")
def get_course(course_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Get Course",
        "data": crud.get_course(db, course_id)
    }


@router.put("/course/update")
def update_course(course: CourseUpdate, db: Session = Depends(get_db)):
    return {
        "msg": "Update course",
        "data": crud.update_course(db, course)
    }

@router.delete("/course/delete/{course_id}")
def delete_course(course_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Delete course",
        "data": crud.delete_course(db, course_id)
    }


@router.get("/course/{course_id}/lesson")
def get_lessons_in_course(course_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Get Lessons from course",
        "data": crud.get_lesson_by_course(db, course_id)
    }


##### Lesson Endpoints #####
@router.post("/lesson/")
def create_lesson(lesson: LessonCreate, db: Session = Depends(get_db)):
    return {
        "msg": "Create Lesson",
        "data": crud.create_lesson(db, lesson)
    }

@router.get("/lesson/info/{lesson_id}")
def get_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Get lesson",
        "data": crud.get_lesson(db, lesson_id)
    }

@router.put("/lesson/update")
def update_lesson(lesson: LessonUpdate, db: Session = Depends(get_db)):
    return {
        "msg": "Update lesson",
        "data": crud.update_lesson(db, lesson)
    }

@router.delete("/lessons/delete/{lesson_id}")
def delete_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Delete lesson",
        "data": crud.delete_lesson(db, lesson_id)
    }


##### Question Endpoints #####
@router.post("/question/")
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    return {
        "msg": "Create question",
        "data": crud.create_question(db, question)
    }

@router.get("/question/info/{question_id}")
def get_question(question_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Question info",
        "data": crud.get_question(db, question_id)
    }

@router.put("/question/update/")
def update_question(question: QuestionUpdate, db: Session = Depends(get_db)):
    return {
        "msg": "Update question",
        "data": crud.update_question(db, question)
    }

@router.delete("/question/delete/{question_id}")
def delete_question(question_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Delete question",
        "data": crud.delete_question(db, question_id)
    }
 

@router.get("/lessons/{lesson_id}/questions")
def get_questions_in_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Get questions by lesson",
        "data": crud.get_question_by_lesson(db, lesson_id)
    }


##### CourseLesson Endpoints #####
@router.post("/course-lesson/create")
def create_course_lesson(cl: CourseLessonCreate, db: Session = Depends(get_db)):
    return {
        "msg": "Create course lesson",
        "data": crud.create_course_lesson(db, cl)
    }

@router.get("/course/{course_id}/course-lesson")
def get_course_lessons(course_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Get course lessons by course id",
        "data": crud.get_course_lessons(db, course_id)
    }


@router.delete("/course/{course_id}/lesson/{lesson_id}/delete")
def delete_course_lesson(course_id: UUID, lesson_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Delete lessons from course!",
        "data": crud.delete_course_lesson(db, course_id, lesson_id)
    }


##### LessonQuestion Endpoints #####
@router.post("/lesson-question/create/")
def create_lesson_question(lq: LessonQuestionCreate, db: Session = Depends(get_db)):
    return {
        "msg": "Create lesson question",
        "data": crud.create_lesson_question(db, lq)
    }

@router.get("/lessons/{lesson_id}/lesson-question")
def get_lesson_questions(lesson_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Get lesson questions by lesson id",
        "data": crud.get_lesson_questions(db, lesson_id)
    }


@router.delete("/lesson/{lesson_id}/question/{question_id}/delete/")
def delete_lesson_question(lesson_id: UUID, question_id: UUID, db: Session = Depends(get_db)):
    return {
        "msg": "Delete lesson question",
        "data": crud.delete_lesson_questions(db, lesson_id, question_id)
    }

