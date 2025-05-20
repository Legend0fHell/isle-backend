type UUID = string;

// --- Course ---

export interface Course {
    course_id: UUID;
    course_name: string;
    course_desc: string;
    course_difficulty: number;
    course_lessons: CourseLesson[];
}


// --- Lesson ---

export interface Lesson {
    lesson_id: UUID;
    lesson_name: string;
    lesson_desc: string;
    lesson_type: string;
}

// --- Question ---

export interface Question {
    question_id: UUID;
    question_type: string;
    question_target: string;
    question_choice: string;
}

// --- CourseLesson ---

export interface CourseLesson {
    cl_entries_id: UUID;
    course_id: UUID;
    lesson_id: UUID;
    index_in_course: number;
}

// --- LessonQuestion ---

export interface LessonQuestion {
    lq_entries_id: UUID;
    lesson_id: UUID;
    question_id: UUID;
    index_in_lesson: number;
}