type UUID = string;

// --- Course ---

export interface CourseCreate {
    course_name: string;
    course_desc?: string;
    course_difficulty?: number;
}

export interface CourseRead {
    course_id: UUID;
    course_name: string;
    course_desc?: string;
    course_difficulty?: number;
}

export interface CourseUpdate {
    course_id: UUID;
    course_name?: string;
    course_desc?: string;
    course_difficulty?: number;
}

export interface CourseDelete {
    course_id: UUID;
}

// --- Lesson ---

export interface LessonCreate {
    lesson_name: string;
    lesson_desc?: string;
    lesson_type: string;
}

export interface LessonRead {
    lesson_id: UUID;
    lesson_name: string;
    lesson_desc?: string;
    lesson_type: string;
}

export interface LessonUpdate {
    lesson_id: UUID;
    lesson_name?: string;
    lesson_desc?: string;
    lesson_type?: string;
}

export interface LessonDelete {
    lesson_id: UUID;
}

// --- Question ---

export interface QuestionCreate {
    question_type: string;
    question_target: string;
    question_choice?: string;
}

export interface QuestionRead {
    question_id: UUID;
    question_type: string;
    question_target: string;
    question_choice?: string;
}

export interface QuestionUpdate {
    question_id: UUID;
    question_type?: string;
    question_target?: string;
    question_choice?: string;
}

export interface QuestionDelete {
    question_id: UUID;
}

// --- CourseLesson ---

export interface CourseLessonCreate {
    course_id: UUID;
    lesson_id: UUID;
    index_in_course?: number;
}

export interface CourseLessonRead {
    cl_entries_id: UUID;
    course_id: UUID;
    lesson_id: UUID;
    index_in_course: number;
}

export interface CourseLessonDelete {
    cl_entries_id: UUID;
}

// --- LessonQuestion ---

export interface LessonQuestionCreate {
    lesson_id: UUID;
    question_id: UUID;
    index_in_lesson?: number;
}

export interface LessonQuestionRead {
    lq_entries_id: UUID;
    lesson_id: UUID;
    question_id: UUID;
    index_in_lesson?: number;
}

export interface LessonQuestionDelete {
    lq_entries_id: UUID;
}
