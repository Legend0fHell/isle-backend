import axios from 'axios';
import { LessonProgressRead } from '../types/user';

// Function get user progress
export const getUserProgress = async (user_id: string, lesson_id: string): Promise<LessonProgressRead[]> => {
    const formdata = new FormData();
    formdata.append("user_id", user_id);
    const requestOptions = {
        method: "GET",
        body: formdata,
        redirect: "follow"
    };
    try {
        const response = await axios.get(`http://localhost:8000/lesson/${user_id}/${lesson_id}`, requestOptions);
        return response.data;
    } catch (error) {
        console.error('Error fetching user progress:', error);
        throw error;
    }
};

// Function to get lesson questions
export const getLessonQuestions = async (lesson_id: string): Promise<any[]> => {
    const formdata = new FormData();
    formdata.append("lesson_id", lesson_id);
    const requestOptions = {
        method: "GET",
        body: formdata,
        redirect: "follow"
    };

    try {
        const response = await axios.get(`http://localhost:8000/lesson/${lesson_id}/questions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lesson questions:', error);
        throw error;
    }
};