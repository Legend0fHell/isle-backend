import { ApiResponse, handleApiResponse } from "../utils/apiUtils";

// Alias cho kiểu char_name
export type ASLCharName = string;

// ----- ASL Character Schema -----
export interface ASL {
    char_name: ASLCharName;
    char_image_url: string;
    char_tutorial_text?: string;
    char_tutorial_url?: string;
}

// Re-export the ASL interface as ASLCharacter for backward compatibility
export type ASLCharacter = ASL;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Function to get all ASL character information
export const getASLCharacters = async (): Promise<ASLCharacter[]> => {
    try {
        const response = await fetch(`${API_URL}/asl`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<ASLCharacter[]> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error fetching ASL characters:', error);
        throw error;
    }
};