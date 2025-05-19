import { Course } from '../types/question';
import axios from 'axios';

const API_URL = 'http://localhost:8000/questions';

// Function to get all courses
export const getAllCourses = async (): Promise<Course[]> => {
    try {
        const response = await axios.get(`${API_URL}/course/list`);
        console.log('Courses fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};





