from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

# Schema để tạo mới khóa học
class CourseCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    difficulty_level: str


# Schema để cập nhật khóa học
class CourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    difficulty_level: Optional[str] = None


# Schema để trả về thông tin khóa học
class Course(BaseModel):
    course_id: UUID
    name: str
    description: Optional[str] = ""
    difficulty_level: str
    created_at: datetime

    class Config:
        orm_mode = True


# Schema để trả về thông tin user đã enroll khóa học
class UserCourseEnrollmentBase(BaseModel):
    enrollment_id: UUID
    user_id: UUID
    course_id: UUID
    enrolled_at: datetime
    completed_at: Optional[datetime] = None
    progress: float

    class Config:
        orm_mode = True


# Schema để tạo bản ghi user enroll vào khóa học
class UserCourseEnrollment(BaseModel):
    user_id: UUID
    course_id: UUID
