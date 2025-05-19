// UUID type alias
type UUID = string;

// ----- User Schemas -----

export interface UserCreate {
    email: string;          // EmailStr tương đương string
    name: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserUpdate {
    user_id: UUID;
    email?: string;
    name?: string;
    password?: string;
}

export interface UserRead {
    user_id: UUID;
    email: string;
    name: string;
    created_at: string;      // datetime trong Python => ISO string
    last_login: string;
}

// ----- Lesson Progress -----

export interface LessonProgressCreate {
    user_id: UUID;
    lesson_id: UUID;
}

export interface LessonProgressRead {
    progress_id: UUID;
    user_id: UUID;
    lesson_id: UUID;
    last_activity_at: string;  // datetime => string
    correct_questions: number;
}

// ----- User Answer -----

export interface UserAnswerCreate {
    progress_id: UUID;
    question_id: UUID;
}

export interface UserAnswerSubmit {
    progress_id: UUID;
    question_id: UUID;
    user_choice: string;
}

export interface UserAnswerRead {
    progress_id: UUID;
    question_id: UUID;
}
