import { ApiResponse, handleApiResponse, UUID } from "../utils/apiUtils";

// ----- Lesson Progress -----
export interface LessonProgress {
    progress_id: UUID;
    user_id: UUID;
    lesson_id: UUID;
    last_activity_at: string;  // datetime => string
    correct_questions: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Progress interfaces based on the database design
export interface UserLessonProgress {
    progress_id: string;
    lesson_id: string;
    last_activity_at: string; // timestamp
    correct_question: number; // Number of correctly answered questions
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
    const payload = { user_id: user_id };
    try {
        const response = await fetch(`${API_URL}/course/progress`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
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

// Function to get recent progress for a specific lesson
export const getRecentLessonProgress = async (user_id: string, lesson_id: string): Promise<LessonProgressResponse> => {
    const payload = { user_id: user_id, lesson_id: lesson_id };
    try {
        const response = await fetch(`${API_URL}/lesson/recent_progress`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<LessonProgressResponse> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error fetching recent lesson progress:', error);
        throw error;
    }
};

// Function to get progress for specific progress_id
export const getLessonProgress = async (progress_id: string): Promise<UserQuestionAnswer[]> => {
    const payload = { progress_id: progress_id };
    try {
        const response = await fetch(`${API_URL}/lesson/progress`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<UserQuestionAnswer[]> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error fetching lesson progress:', error);
        throw error;
    }
};

// Function to mark lesson progress as complete
export const completeLessonProgress = async (progress_id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/progress/${progress_id}/complete`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // Add Authorization header if your API requires it
            },
            // No body needed for this example, but you might send one
        });

        if (!response.ok) {
            // Attempt to parse error message from backend if available
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

        // For a POST request that completes something, usually there isn't a detailed body response
        // unless it's returning the updated resource or a success message.
        // If your API returns a specific success message or data, handle it here.
        console.log(`Lesson progress ${progress_id} marked as complete.`);
        // Example: const data: ApiResponse<any> = await response.json(); 
        // return handleApiResponse(data); // if you expect a body
        return; // If no specific data is returned on success other than status 200/204

    } catch (error) {
        console.error('Error completing lesson progress:', error);
        throw error;
    }
};

