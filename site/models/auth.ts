import { UserLogin, UserRead, UserCreate } from '../types/user';
import axios from 'axios';

const API_URL = 'http://localhost:8000/users';

// Function to log in a user
export const login = async (user: UserLogin): Promise<UserRead> => {
    const formdata = new FormData();
    formdata.append("email", user.email);
    formdata.append("password", user.password);
    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };
    try {
        const response = await axios.post(`${API_URL}/login`, requestOptions);
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

// Function to register a new user
export const register = async (user: UserCreate): Promise<UserRead> => {
    const formdata = new FormData();
    formdata.append("name", user.name);
    formdata.append("email", user.email);
    formdata.append("password", user.password);
    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };
    try {
        const response = await axios.post(`${API_URL}/register`, requestOptions);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Function to get user details
export const getUser = async (user_id: string): Promise<UserRead> => {
    const formdata = new FormData();
    formdata.append("user_id", user_id);
    const requestOptions = {
        method: "GET",
        body: formdata,
        redirect: "follow"
    };

    try {
        const response = await axios.get(`${API_URL}/${user_id}`, requestOptions);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};