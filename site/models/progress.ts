import { ApiResponse, handleApiResponse, UUID } from "../utils/apiUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Progress interfaces based on the database design
export interface UserLessonProgress {
    progress_id: UUID;
    user_id: UUID;
    lesson_id: UUID;
    last_activity_at: string; // timestamp
    correct_questions: number; // Number of correctly answered questions
}

export interface UserQuestionAnswer {
    question_id: string;
    user_choice: string;
    is_correct: boolean;
}

export interface LessonProgressResponse {
    progress_id: string;
    questions: UserQuestionAnswer[];
}

// Function to get user's progress across all lessons
export const getUserProgress = async (user_id: string): Promise<UserLessonProgress[]> => {
    try {
        const response = await fetch(`${API_URL}/progress/course?user_id=${user_id}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<UserLessonProgress[]> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error fetching user progress:', error);
        throw error;
    }
};

// Interface for the combined response from lesson/start
export interface LessonStartResponse {
    progress: UserLessonProgress;
    user_answers: UserQuestionAnswer[];
}

// Function to start a lesson - this handles both new and existing progress
export const startLesson = async (user_id: string, lesson_id: string): Promise<LessonStartResponse> => {
    try {
        const response = await fetch(`${API_URL}/lesson/start?user_id=${user_id}&lesson_id=${lesson_id}`, {
            method: "POST",
        });

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.detail) {
                    errorMessage = `Error: ${errorData.detail}`;
                } else if (errorData && errorData.message) {
                    errorMessage = `Error: ${errorData.message}`;
                }
            } catch (_e) {
                // Ignore if response is not JSON or other parsing error
                console.error('Error parsing error response:', _e);
            }
            throw new Error(errorMessage);
        }

        const data: ApiResponse<LessonStartResponse> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error starting lesson:', error);
        throw error;
    }
};

