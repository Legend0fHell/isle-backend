'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Course, getAllCourses, LessonSummary } from '../../../models/course'; // Corrected path
import { UserLessonProgress, getUserProgress } from '../../../models/progress'; // Corrected path
import { User } from '../../../models/user'; // Corrected path

// Helper function to get user from localStorage
const getStoredUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.id) {
                    return { 
                        user_id: parsedUser.id, 
                        name: parsedUser.name, 
                        email: parsedUser.email 
                    } as User;
                }
            } catch (e) {
                console.error("Failed to parse stored user:", e);
                return null;
            }
        }
    }
    return null;
};

const CoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [userProgress, setUserProgress] = useState<UserLessonProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            const storedUser = getStoredUser();
            setCurrentUser(storedUser);

            try {
                const coursesData = await getAllCourses();
                setCourses(coursesData);

                if (storedUser && storedUser.user_id) {
                    // Ensure getUserProgress expects user_id as string (it does in your model)
                    const progressData = await getUserProgress(storedUser.user_id as string);
                    setUserProgress(progressData);
                }
            } catch (err) {
                console.error("Error fetching courses or progress:", err);
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getLessonProgressDisplay = (lesson: LessonSummary) => {
        const progress = userProgress.find((p: UserLessonProgress) => p.lesson_id === lesson.lesson_id);
        if (progress) {
            // lesson_num_question is now directly available on LessonSummary type
            if (lesson.lesson_num_question > 0) {
                 return `${progress.correct_question}/${lesson.lesson_num_question} correct`;
            }
            return `${progress.correct_question} correct`;
        }
        return "Not started";
    };

    if (isLoading) {
        return <div className="container mx-auto p-4 text-center">Loading courses...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Available Courses</h1>
            {!currentUser && (
                <p className="text-center text-yellow-600 mb-4">
                    You are not logged in. Progress will not be saved or displayed.
                    <Link href="/login" className="text-blue-500 hover:underline ml-2">
                        Login here
                    </Link>
                </p>
            )}
            {courses.length === 0 && !isLoading ? (
                <p className="text-center">No courses available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course: Course) => (
                        <div key={course.course_id} className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-2">{course.course_name}</h2>
                            <p className="text-gray-700 mb-1">{course.course_desc}</p>
                            <p className="text-sm text-gray-500 mb-4">Difficulty: {course.course_difficulty}/5</p>
                            
                            <h3 className="text-lg font-medium mb-2 mt-4">Lessons:</h3>
                            {course.course_lessons && course.course_lessons.length > 0 ? (
                                <ul className="list-disc list-inside pl-4 space-y-2">
                                    {course.course_lessons.map((lesson: LessonSummary) => (
                                        <li key={lesson.lesson_id} className="text-gray-800">
                                            <Link href={`/lessons/${lesson.lesson_id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                                                {lesson.lesson_name} 
                                                {lesson.lesson_desc && <span className="text-xs text-gray-600 italic"> - {lesson.lesson_desc}</span>}
                                            </Link>
                                            {currentUser && (
                                                <span className="text-sm text-gray-500 ml-2">
                                                    ({getLessonProgressDisplay(lesson)})
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No lessons in this course yet.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
