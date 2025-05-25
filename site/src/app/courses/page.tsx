'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Course, getAllCourses, LessonSummary } from '../../../models/course';
import { UserLessonProgress, getUserProgress } from '../../../models/progress';
import { User } from '../../../models/user';
import Navbar from '../../components/navbar';
import { Star, StarHalf } from 'lucide-react';

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

// Star rating component
const DifficultyStars = ({ difficulty }: { difficulty: number }) => {
    const fullStars = Math.floor(difficulty);
    const hasHalfStar = difficulty % 1 >= 0.5;
    const maxStars = 5;
    
    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            ))}
            {hasHalfStar && <StarHalf className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
            {[...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
            ))}
        </div>
    );
};

// Progress indicator component
const ProgressIndicator = ({ progress, total }: { progress: number; total: number }) => {
    const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;
    
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-1">
            <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${percentage}%` }}
            ></div>
            <span className="text-xs text-gray-600">{progress}/{total} questions correct</span>
        </div>
    );
};

const CoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [userProgress, setUserProgress] = useState<UserLessonProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [progressLoaded, setProgressLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            const storedUser = getStoredUser();
            setCurrentUser(storedUser);

            try {
                // Fetch courses data
                const coursesData = await getAllCourses();
                setCourses(coursesData);

                // Fetch progress data if user is logged in
                if (storedUser && storedUser.user_id) {
                    try {
                        const progressData = await getUserProgress(storedUser.user_id as string);
                        setUserProgress(progressData);
                        setProgressLoaded(true);
                    } catch (progressError) {
                        console.error("Error fetching user progress:", progressError);
                        // Don't set the main error - just log it
                    }
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError(err instanceof Error ? err.message : "Failed to load courses data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getLessonProgressDisplay = (lesson: LessonSummary) => {
        if (!currentUser) return null;
        
        const progress = userProgress.find((p: UserLessonProgress) => p.lesson_id === lesson.lesson_id);
        
        if (progress) {
            if (lesson.lesson_num_question > 0) {
                return (
                    <ProgressIndicator 
                        progress={progress.correct_questions} 
                        total={lesson.lesson_num_question} 
                    />
                );
            }
            return <span className="text-sm text-green-600">{progress.correct_questions} correct</span>;
        }
        
        return <span className="text-sm text-gray-500">Not started</span>;
    };

    // Calculate course progress
    const getCourseProgress = (course: Course) => {
        if (!currentUser || !progressLoaded || !course.course_lessons || course.course_lessons.length === 0) {
            return { completed: 0, total: 0 };
        }
        
        const totalLessons = course.course_lessons.length;
        let completedLessons = 0;
        
        course.course_lessons.forEach(lesson => {
            const progress = userProgress.find(p => p.lesson_id === lesson.lesson_id);
            if (progress && progress.correct_questions > 0) {
                if (lesson.lesson_num_question > 0 && progress.correct_questions >= lesson.lesson_num_question) {
                    completedLessons++;
                }
            }
        });
        
        return { completed: completedLessons, total: totalLessons };
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            
            <div className="container mx-auto p-4 pt-20">
                <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Available Courses</h1>
                
                {!currentUser && (
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-6">
                        <p className="text-yellow-600 dark:text-yellow-400">
                            You are not logged in. Progress will not be saved or displayed.
                            <Link href="/login" className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                Login here
                            </Link>
                        </p>
                    </div>
                )}
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                        <p>Error loading courses: {error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <p className="dark:text-gray-300">No courses available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course: Course) => {
                            const { completed, total } = getCourseProgress(course);
                            const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                            
                            return (
                                <div 
                                    key={course.course_id} 
                                    className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.02] hover:shadow-xl"
                                >
                                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30">
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{course.course_name}</h2>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1">{course.course_desc}</p>
                                        
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="flex items-center space-x-1">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Difficulty:</span>
                                                <DifficultyStars difficulty={course.course_difficulty} />
                                            </div>
                                            
                                            {currentUser && progressLoaded && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {completionPercentage}% complete
                                                </div>
                                            )}
                                        </div>
                                        
                                        {currentUser && progressLoaded && total > 0 && (
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                                                <div 
                                                    className="bg-green-600 h-1.5 rounded-full" 
                                                    style={{ width: `${completionPercentage}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Lessons</h3>
                                        
                                        {course.course_lessons && course.course_lessons.length > 0 ? (
                                            <ul className="space-y-3">
                                                {course.course_lessons.map((lesson: LessonSummary) => (
                                                    <li key={lesson.lesson_id} className="border-b pb-2 border-gray-100 dark:border-gray-700 last:border-0">
                                                        <Link 
                                                            href={`/lessons/${lesson.lesson_id}`} 
                                                            className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition-colors"
                                                        >
                                                            <div className="flex justify-between">
                                                                <div>
                                                                    <span className="font-medium text-blue-600 dark:text-blue-400">{lesson.lesson_name}</span>
                                                                    {lesson.lesson_desc && (
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lesson.lesson_desc}</p>
                                                                    )}
                                                                </div>
                                                                
                                                                <div className="flex items-center text-sm">
                                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                                        lesson.lesson_type === 'test' 
                                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                                                            : lesson.lesson_type === 'practice' 
                                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                    }`}>
                                                                        {lesson.lesson_type}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            {currentUser && progressLoaded && getLessonProgressDisplay(lesson)}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No lessons available for this course yet.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesPage;
