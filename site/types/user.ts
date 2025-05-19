// UUID type alias
type UUID = string;

// ----- User Schemas -----

export interface User {
    user_id: UUID;
    email: string;
    name: string;
    created_at: string;      // datetime trong Python => ISO string
    last_login: string;
}

// ----- Lesson Progress -----

export interface LessonProgress {
    progress_id: UUID;
    user_id: UUID;
    lesson_id: UUID;
    last_activity_at: string;  // datetime => string
    correct_questions: number;
}

// ----- User Answer -----

export interface UserAnswer {
    progress_id: UUID;
    question_id: UUID;
    user_choice: string;
}

