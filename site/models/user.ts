import { ApiResponse, handleApiResponse, UUID } from "../utils/apiUtils";

// ----- User Schemas -----
export interface User {
    user_id: UUID;
    email: string;
    name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to log in a user
export const login = async (email: string, password: string): Promise<User> => {
    const payload = {
        email: email,
        password: password
    };

    try {
        const response = await fetch(`${API_URL}/user/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            // Attempt to parse error response from backend if available
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.detail) { // FastAPI often puts validation errors in 'detail'
                    errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
                } else if (errorData && errorData.msg) {
                    errorMessage = errorData.msg.substring(6);
                }
            } catch {
                // Error parsing the error response body, proceed with generic HTTP error
            }
            throw new Error(errorMessage);
        }

        const data: ApiResponse<User> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

// Function to register a new user
export const register = async (user: User, password: string): Promise<User> => {
    const payload = {
        name: user.name,
        email: user.email,
        password: password
    };

    try {
        const response = await fetch(`${API_URL}/user/register`, {
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

        const data: ApiResponse<User> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Function to get user details
export const getUser = async (user_id: string): Promise<User> => {
    const payload = { user_id: user_id };
    try {
        const response = await fetch(`${API_URL}/user/info`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<User> = await response.json();
        return handleApiResponse(data);
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

// Function to log out a user (client-side only)
export const logout = async (): Promise<void> => {
    try {
        // Clear user from localStorage
        localStorage.removeItem('user');
        
        // Clear any auth tokens if they exist
        localStorage.removeItem('authToken');
        
        // No need to call the backend as specified
        console.log('User logged out successfully');
        
        return Promise.resolve();
    } catch (error) {
        console.error('Error during logout:', error);
        return Promise.reject(error);
    }
}; 

