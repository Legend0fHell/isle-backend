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

router = APIRouter(prefix="/questions", tags=["Questions"])


##### Course Endpoints #####
@router.post("/courses/", response_model=CourseRead)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    return crud.create_course(db, course)

@router.get("/courses/{course_id}", response_model=CourseRead)
def get_course(course_id: UUID, db: Session = Depends(get_db)):
    return crud.get_course(db, course_id)

@router.put("/courses/", response_model=CourseRead)
def update_course(course: CourseUpdate, db: Session = Depends(get_db)):
    return crud.update_course(db, course)

@router.delete("/courses/{course_id}")
def delete_course(course_id: UUID, db: Session = Depends(get_db)):
    return crud.delete_course(db, course_id)

@router.get("/courses/{course_id}/lessons", response_model=List[LessonRead])
def get_lessons_in_course(course_id: UUID, db: Session = Depends(get_db)):
    return crud.get_lesson_by_course(db, course_id)


##### Lesson Endpoints #####
@router.post("/lessons/", response_model=LessonRead)
def create_lesson(lesson: LessonCreate, db: Session = Depends(get_db)):
    return crud.create_lesson(db, lesson)

@router.get("/lessons/{lesson_id}", response_model=LessonRead)
def get_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return crud.get_lesson(db, lesson_id)

@router.put("/lessons/", response_model=LessonRead)
def update_lesson(lesson: LessonUpdate, db: Session = Depends(get_db)):
    return crud.update_lesson(db, lesson)

@router.delete("/lessons/{lesson_id}")
def delete_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return crud.delete_lesson(db, lesson_id)


##### Question Endpoints #####
@router.post("/questions/", response_model=QuestionRead)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, question)

@router.get("/questions/{question_id}", response_model=QuestionRead)
def get_question(question_id: UUID, db: Session = Depends(get_db)):
    return crud.get_question(db, question_id)

@router.put("/questions/", response_model=QuestionRead)
def update_question(question: QuestionUpdate, db: Session = Depends(get_db)):
    return crud.update_question(db, question)

@router.delete("/questions/{question_id}")
def delete_question(question_id: UUID, db: Session = Depends(get_db)):
    return crud.delete_question(db, question_id)

@router.get("/lessons/{lesson_id}/questions", response_model=List[QuestionRead])
def get_questions_in_lesson(lesson_id: UUID, db: Session = Depends(get_db)):
    return crud.get_question_by_lesson(db, lesson_id)


##### CourseLesson Endpoints #####
@router.post("/course-lessons/", response_model=CourseLessonRead)
def create_course_lesson(cl: CourseLessonCreate, db: Session = Depends(get_db)):
    return crud.create_course_lesson(db, cl)

@router.get("/courses/{course_id}/course-lessons", response_model=List[CourseLessonRead])
def get_course_lessons(course_id: UUID, db: Session = Depends(get_db)):
    return crud.get_course_lessons(db, course_id)

@router.delete("/courses/{course_id}/lessons/{lesson_id}")
def delete_course_lesson(course_id: UUID, lesson_id: UUID, db: Session = Depends(get_db)):
    return crud.delete_course_lesson(db, course_id, lesson_id)


##### LessonQuestion Endpoints #####
@router.post("/lesson-questions/", response_model=LessonQuestionRead)
def create_lesson_question(lq: LessonQuestionCreate, db: Session = Depends(get_db)):
    return crud.create_lesson_question(db, lq)

@router.get("/lessons/{lesson_id}/lesson-questions", response_model=List[LessonQuestionRead])
def get_lesson_questions(lesson_id: UUID, db: Session = Depends(get_db)):
    return crud.get_lesson_questions(db, lesson_id)

@router.delete("/lessons/{lesson_id}/questions/{question_id}")
def delete_lesson_question(lesson_id: UUID, question_id: UUID, db: Session = Depends(get_db)):
    return crud.delete_lesson_questions(db, lesson_id, question_id)
