from pydantic import BaseModel, model_validator
from typing import List, Optional
from uuid import UUID

# ================================
# Choice Question Schemas
# ================================

class ChoiceQuestionBase(BaseModel):
    image_url: str
    correct_answer: str
    options: List[str]

class ChoiceQuestionCreate(ChoiceQuestionBase):
    pass

class ChoiceQuestionRead(ChoiceQuestionBase):
    question_id: UUID

    class Config:
        orm_mode = True

# ================================
# Input Question Schemas
# ================================

class InputQuestionBase(BaseModel):
    target_text: str
    text_type: str

class InputQuestionCreate(InputQuestionBase):
    pass

class InputQuestionRead(InputQuestionBase):
    question_id: UUID

    class Config:
        orm_mode = True

# ================================
# Main Question Schemas
# ================================

class QuestionBase(BaseModel):
    course_id: UUID
    question_type: str
    question_order: int

class QuestionCreate(QuestionBase):
    input_question: Optional[InputQuestionCreate] = None
    choice_question: Optional[ChoiceQuestionCreate] = None

    @model_validator(mode="after")
    def validate_question_type(cls, values):
        # 'values' is the full model instance here, so use dot notation:
        if values.input_question and values.choice_question:
            raise ValueError("Chỉ được chọn 1 loại câu hỏi: input hoặc choice (không phải cả hai).")
        if not values.input_question and not values.choice_question:
            raise ValueError("Phải cung cấp ít nhất một loại câu hỏi: input hoặc choice.")
        return values

class QuestionRead(QuestionBase):
    question_id: UUID
    input_question: Optional[InputQuestionRead] = None
    choice_question: Optional[ChoiceQuestionRead] = None

    class Config:
        orm_mode = True