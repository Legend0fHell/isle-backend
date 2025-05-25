'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, logout as userLogout } from '../../models/user'; // Import the logout function

interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
    setCurrentUser: (user: User | null) => void; // Allow manual setting, e.g., after login/logout
    logout: () => Promise<void>; // Add logout function to the interface
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUserInternal] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // Basic validation for parsedUser structure
                if (parsedUser && (parsedUser.user_id || parsedUser.id) && parsedUser.email) {
                    setCurrentUserInternal({
                        user_id: parsedUser.user_id || parsedUser.id, // Handle both user_id and id from localStorage
                        name: parsedUser.name || '',
                        email: parsedUser.email,
                    });
                } else {
                    localStorage.removeItem('user'); // Clear invalid stored user
                }
            }
        } catch (e) {
            console.error("Failed to load user from localStorage:", e);
            setError("Failed to load user session.");
            localStorage.removeItem('user'); // Clear potentially corrupted data
        } finally {
            setIsLoading(false);
        }
    }, []);

    const setCurrentUser = (user: User | null) => {
        setCurrentUserInternal(user);
        if (user) {
            // Ensure stored user has `id` property for consistency if your login saves it as `id`
            const userToStore = { ...user, id: user.user_id }; 
            localStorage.setItem('user', JSON.stringify(userToStore));
        } else {
            localStorage.removeItem('user');
        }
    };

    // Implement logout function using the imported userLogout
    const logout = async () => {
        try {
            await userLogout();
            setCurrentUserInternal(null); // Clear user from context
            return Promise.resolve();
        } catch (error) {
            console.error("Error during logout:", error);
            return Promise.reject(error);
        }
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            isLoading,
            error,
            setCurrentUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 