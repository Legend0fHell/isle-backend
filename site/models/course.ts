import { ApiResponse, handleApiResponse, UUID } from "../utils/apiUtils";

// ----- Lesson Summary (for /course/list response) -----
export interface LessonSummary {
    lesson_id: UUID;
    lesson_name: string;
    lesson_desc: string;
    lesson_type: string;
    lesson_num_question: number; // As per API spec for /course/list
}

// ----- Course Schema -----
export interface Course {
    course_id: UUID;
    course_name: string;
    course_desc: string;
    course_difficulty: number;
    course_lessons: LessonSummary[]; // Updated to use LessonSummary
}

// ----- Full Lesson Schema (potentially for /lesson/list response, though that one returns Question[]) -----
// This might be used if you have an endpoint that returns full lesson details separately.
// For now, it aligns with the fields described in the API document for lessons within a course.
export interface LessonDetail {
    lesson_id: UUID;
    lesson_name: string;
    lesson_desc: string;
    lesson_type: string;
    // lesson_num_question might also be here if fetched from a dedicated lesson endpoint
}

// Define a more specific type for lesson_type based on your design
export type LessonType = 'learn' | 'practice' | 'test';

export interface LessonDetails {
    lesson_id: UUID;
    name: string;
    description: string;
    lesson_type: LessonType;
    estimated_duration: number; // in minutes
    next_lesson_id?: string; // Optional ID of the next lesson in the course
    // video_url?: string; // Optional: if a lesson has a primary video (e.g. for 'learn' type)
    // Add other relevant fields like difficulty, prerequisites, etc.
}

// ----- CourseLesson (Linking Table, as originally defined) -----
// This represents the DB table structure, distinct from what /course/list might return directly for lessons.
export interface CourseLessonEntry {
    cl_entries_id: UUID;
    course_id: UUID;
    lesson_id: UUID;
    index_in_course: number;
}

// ----- LessonQuestion (Linking Table, as originally defined) -----
export interface LessonQuestionEntry {
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

// Mock function to get lesson details - replace with actual API call
export const getLessonDetails = async (lessonId: UUID): Promise<LessonDetails> => {
    console.log(`Mock fetch for lesson details: ${lessonId}`);
    // MOCK DATA - Replace with actual API call
    const mockLessonDetails: { [key: string]: LessonDetails } = {
        "lesson1-intro-asl": { lesson_id: "lesson1-intro-asl", name: "Introduction to ASL", description: "Learn the basics of ASL, including the alphabet and common greetings.", lesson_type: "learn", estimated_duration: 15 },
        "lesson2-basic-phrases": { lesson_id: "lesson2-basic-phrases", name: "Basic Conversation Phrases", description: "Practice common phrases for everyday conversations.", lesson_type: "practice", estimated_duration: 20 },
        "lesson3-test-alphabet": { lesson_id: "lesson3-test-alphabet", name: "Alphabet Test", description: "Test your knowledge of the ASL alphabet.", lesson_type: "test", estimated_duration: 10 }
    };

    return new Promise((resolve, reject) => {
        // Simulate API call delay
        setTimeout(() => {
            if (mockLessonDetails[lessonId]) {
                // Make sure to return all required fields for LessonDetails
                const lessonData = mockLessonDetails[lessonId];
                resolve({
                    lesson_id: lessonData.lesson_id,
                    name: lessonData.name,
                    description: lessonData.description,
                    lesson_type: lessonData.lesson_type,
                    estimated_duration: lessonData.estimated_duration || 5, // Ensure estimated_duration is present
                    // next_lesson_id will be undefined if not present in mock data, which is fine
                    next_lesson_id: lessonData.next_lesson_id 
                });
            } else {
                reject(new Error("Lesson details not found"));
            }
        }, 500);
    });
}; 