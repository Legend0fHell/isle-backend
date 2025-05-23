// UUID type alias
export type UUID = string;

// Define the standard API response format
export interface ApiResponse<T> {
    msg: string;
    data: T;
}

// Function to handle API response and check for errors
export function handleApiResponse<T>(response: ApiResponse<T>): T {
    if (response.msg === "ok") {
        return response.data;
    } else {
        // Extract error message from msg field
        const errorMessage = response.msg.startsWith("error ")
            ? response.msg.substring(6)
            : response.msg;
        throw new Error(errorMessage);
    }
} 