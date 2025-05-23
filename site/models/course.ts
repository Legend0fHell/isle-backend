import { ApiResponse, handleApiResponse, UUID } from "../utils/apiUtils";

// ----- Course Schema -----
export interface Course {
    course_id: UUID;
    course_name: string;
    course_desc: string;
    course_difficulty: number;
    course_lessons: CourseLesson[];
}

// ----- Lesson Schema -----
export interface Lesson {
    lesson_id: UUID;
    lesson_name: string;
    lesson_desc: string;
    lesson_type: string;
}

// ----- CourseLesson Schema -----
export interface CourseLesson {
    cl_entries_id: UUID;
    course_id: UUID;
    lesson_id: UUID;
    index_in_course: number;
}

// ----- Lesson Question -----
export interface LessonQuestion {
    lq_entries_id: UUID;
    lesson_id: UUID;
    question_id: UUID;
    index_in_lesson: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to get all courses with their lessons
export const getAllCourses = async (): Promise<Course[]> => {
    try {
        const response = await fetch(`${API_URL}/course/list`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<Course[]> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}; 