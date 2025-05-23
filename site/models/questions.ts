import { ApiResponse, handleApiResponse, UUID } from "../utils/apiUtils";

// ----- Question Schema -----
export interface Question {
    question_id: UUID;
    question_type: string;
    question_target: string;
    question_choice: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to check answer for a question
export const checkQuestionAnswer = async (
    progress_id: string, 
    question_id: string, 
    user_choice: string
): Promise<boolean> => {
    const payload = {
        progress_id: progress_id,
        question_id: question_id,
        user_choice: user_choice
    };

    try {
        const response = await fetch(`${API_URL}/lesson/check`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.detail) {
                    errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
                } else if (errorData && errorData.msg) {
                    errorMessage = errorData.msg;
                }
            } catch {
                // Error parsing the error response body, proceed with generic HTTP error
            }
            throw new Error(errorMessage);
        }

        const data: ApiResponse<boolean> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error checking question answer:', error);
        throw error;
    }
};

// Function to get lesson questions
export const getLessonQuestions = async (lesson_id: string): Promise<Question[]> => {
    const payload = { lesson_id: lesson_id };
    try {
        const response = await fetch(`${API_URL}/lesson/list`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<Question[]> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error fetching lesson questions:', error);
        throw error;
    }
}; 