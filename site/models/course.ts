import { ApiResponse, handleApiResponse, UUID } from "../utils/apiUtils";

/**
 * Lesson Summary (for /course/list response)
 * As defined in the database schema
 */
export interface LessonSummary {
    lesson_id: UUID;
    lesson_name: string;
    lesson_desc: string;
    lesson_type: string;
    lesson_num_question: number; // Number of questions in the lesson (calculated by backend)
}

/**
 * Course Schema
 * As defined in the database schema
 */
export interface Course {
    course_id: UUID;
    course_name: string;
    course_desc: string;
    course_difficulty: number;
    course_lessons: LessonSummary[]; // Array of lessons in order
}

/**
 * UserLessonProgress Schema
 * As defined in the database schema
 */
export interface UserLessonProgress {
    progress_id: UUID;
    lesson_id: UUID;
    last_activity_at: string; // Timestamp
    correct_question: number; // Number of correctly answered questions
}

/**
 * Lesson Type enum
 * As defined in the documentation
 */
export type LessonType = 'learn' | 'practice' | 'test';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get all courses with their lessons
 * Endpoint: /course/list
 * 
 * Request: {}
 * Response: List<Course>
 */
export const getAllCourses = async (): Promise<Course[]> => {
    try {
        const response = await fetch(`${API_URL}/course/list`, {
            method: "GET", // According to the docs this is a POST request
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
