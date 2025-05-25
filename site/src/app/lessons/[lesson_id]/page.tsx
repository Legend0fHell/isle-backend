'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Question, getLessonQuestions, checkQuestionAnswer } from '../../../../models/questions'; 
import { startLesson } from '../../../../models/progress'; 
import { LessonType, getAllCourses, LessonSummary } from '../../../../models/course'; // Import getAllCourses
import QuestionDisplay from '../../../components/QuestionComponents/QuestionDisplay';
import HintPopup from '../../../components/HintPopup';
import { useAuth } from '../../../contexts/AuthContext'; // Import useAuth
import Navbar from '../../../components/navbar';

// Define LessonDetails interface locally since it's no longer in course.ts
export interface LessonDetails {
    lesson_id: string;
    name: string;
    description: string;
    lesson_type: LessonType;
    next_lesson_id?: string;
}

// Implement getLessonDetails function that uses the course list API
const getLessonDetails = async (lessonId: string): Promise<LessonDetails> => {
    try {
        // Get all courses with their lessons
        const courses = await getAllCourses();
        
        // Find the lesson with the matching lesson_id
        let foundLesson: LessonSummary | null = null;
        let nextLessonId: string | undefined = undefined;
        
        // Search through all courses and their lessons
        for (const course of courses) {
            for (let i = 0; i < course.course_lessons.length; i++) {
                const lesson = course.course_lessons[i];
                if (lesson.lesson_id === lessonId) {
                    foundLesson = lesson;
                    // Check if there's a next lesson in this course
                    if (i < course.course_lessons.length - 1) {
                        nextLessonId = course.course_lessons[i + 1].lesson_id;
                    }
                    break;
                }
            }
            if (foundLesson) break;
        }
        
        if (!foundLesson) {
            throw new Error(`Lesson with ID ${lessonId} not found in any course`);
        }
        
        // Transform the LessonSummary to LessonDetails
        const lessonDetails: LessonDetails = {
            lesson_id: foundLesson.lesson_id,
            name: foundLesson.lesson_name,
            description: foundLesson.lesson_desc,
            lesson_type: foundLesson.lesson_type as LessonType,
            next_lesson_id: nextLessonId
        };
        
        return lessonDetails;
    } catch (error) {
        console.error('Error fetching lesson details:', error);
        throw error;
    }
};

interface UserAnswersMap {
    [questionId: string]: { user_choice: string; is_correct: boolean };
}

// New interface for course display in sidebar
interface CourseWithLessons {
    course_id: string;
    course_name: string;
    course_lessons: LessonSummary[];
}

// Define interfaces for test results
interface TestResult {
    question_id: string;
    is_correct: boolean;
}

// Custom modal for test results
const TestResultsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    results: TestResult[];
    totalQuestions: number;
}> = ({ isOpen, onClose, results, totalQuestions }) => {
    if (!isOpen) return null;
    
    const correctAnswers = results.filter(r => r.is_correct).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
            <div className="relative p-8 bg-white dark:bg-gray-800 w-full max-w-md m-auto rounded-lg shadow-xl">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Test Results</h2>
                    
                    <div className="mb-6">
                        <div className="text-5xl font-bold mb-2">{score}%</div>
                        <p className="text-lg">
                            You got <span className="font-bold text-green-600">{correctAnswers}</span> out of <span className="font-bold">{totalQuestions}</span> questions correct
                        </p>
                    </div>
                    
                    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                        {results.map((result, index) => (
                            <div 
                                key={index} 
                                className={`p-2 rounded-md flex justify-between items-center
                                    ${result.is_correct 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}
                            >
                                <span>Question {index + 1}</span>
                                <span>{result.is_correct ? '✓ Correct' : '✗ Incorrect'}</span>
                            </div>
                        ))}
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const LessonPage = () => {
    const params = useParams();
    const lessonId = params.lesson_id as string;
    const router = useRouter(); // Initialize router

    const { currentUser, isLoading: authLoading, error: authError } = useAuth(); // Use AuthContext

    const [lessonDetails, setLessonDetails] = useState<LessonDetails | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswersMap>({});
    const [progressId, setProgressId] = useState<string | null>(null);
    const [isLoadingPageData, setIsLoadingPageData] = useState(true); // Renamed to avoid conflict with authLoading
    const [pageError, setPageError] = useState<string | null>(null); // Renamed
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Add success message state
    
    const [isHintOpen, setIsHintOpen] = useState(false);
    const [hintCharacterName, setHintCharacterName] = useState<string | null>(null);
    const [isSubmittingLesson, setIsSubmittingLesson] = useState(false); // New state for submission loading
    // currentLessonType will now come from lessonDetails.lesson_type

    // New state for storing all courses and lessons
    const [coursesWithLessons, setCoursesWithLessons] = useState<CourseWithLessons[]>([]);

    // Add these variables to the LessonPage component state
    const [isResultsPopupOpen, setIsResultsPopupOpen] = useState<boolean>(false);
    const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
    const [testResults, setTestResults] = useState<TestResult[]>([]);

    const handleAnswerSubmit = useCallback(async (questionId: string, userAnswer: string, isCorrectProvided?: boolean) => {
        console.log(`Answer submit called: questionId=${questionId}, userAnswer="${userAnswer}", isCorrectProvided=${isCorrectProvided}`);
        
        if (!currentUser || !currentUser.user_id) {
            console.log("No current user, not sending to backend");
            setPageError("You must be logged in to submit answers.");
             // If not logged in, still update UI for immediate feedback for choice/learn questions, but don't save.
            if (isCorrectProvided !== undefined) {
                 setUserAnswers(prevAnswers => ({
                    ...prevAnswers,
                    [questionId]: { user_choice: userAnswer, is_correct: isCorrectProvided }
                }));
            } else {
                // For choice questions without login, determine correctness locally if possible (e.g. for choice type)
                // This is a simplification; ideally, the backend would handle this even for non-logged in if desired.
                const question = questions.find(q => q.question_id === questionId);
                if (question && (question.question_type === 'choice_to_char' || question.question_type === 'choice_to_image')) {
                    setUserAnswers(prevAnswers => ({
                        ...prevAnswers,
                        [questionId]: { user_choice: userAnswer, is_correct: userAnswer === question.question_target }
                    }));
                }
            }
            return; 
        }
        
        if (!progressId) {
            console.log("No progressId found, not sending to backend");
            setPageError("Progress ID not found. Cannot submit answer.");
            return;
        }

        try {
            const isCorrect = await checkQuestionAnswer(progressId, questionId, userAnswer);
            
            // Update local state
            setUserAnswers(prevAnswers => ({
                ...prevAnswers,
                [questionId]: { user_choice: userAnswer, is_correct: isCorrect }
            }));
        } catch (err) {
            console.error("Error submitting answer:", err);
            setPageError(err instanceof Error ? err.message : 'Failed to submit answer');
        }
    }, [progressId, currentUser, questions]);

    useEffect(() => {
        if (!lessonId) {
            setPageError("Lesson ID is missing.");
            setIsLoadingPageData(false);
            return;
        }
        if (authLoading) {
            // Wait for auth state to resolve before fetching data that might depend on user_id
            setIsLoadingPageData(true);
            return;
        }

        const fetchData = async () => {
            setIsLoadingPageData(true);
            setPageError(null);
            try {
                // Fetch all courses first to build the sidebar
                const allCourses = await getAllCourses();
                setCoursesWithLessons(allCourses);
                
                // Find which course contains the current lesson
                for (const course of allCourses) {
                    const foundLesson = course.course_lessons.find(lesson => lesson.lesson_id === lessonId);
                    if (foundLesson) {
                        break;
                    }
                }
                
                // Continue with existing logic to fetch lesson details
                const details = await getLessonDetails(lessonId);
                setLessonDetails(details);

                const fetchedQuestions = await getLessonQuestions(lessonId);
                setQuestions(fetchedQuestions);
                
                let initialQuestionIndex = 0;
                if (currentUser && currentUser.user_id) {
                    try {
                        // Call lesson/start to either create new progress or get existing progress
                        const lessonStartData = await startLesson(currentUser.user_id, lessonId);
                        
                        // Extract progress data
                        if (lessonStartData.progress && lessonStartData.progress.progress_id) {
                            const pid = lessonStartData.progress.progress_id;
                            console.log(`Setting progressId: ${pid}`);
                            setProgressId(pid);
                    
                            // Process any existing user answers
                            if (lessonStartData.user_answers && lessonStartData.user_answers.length > 0) {
                                console.log(`Found ${lessonStartData.user_answers.length} existing answers`);
                                const answersMap: UserAnswersMap = {};
                                lessonStartData.user_answers.forEach(ans => {
                                    answersMap[ans.question_id] = { 
                                        user_choice: ans.user_choice, 
                                        is_correct: ans.is_correct 
                                    };
                                });
                                setUserAnswers(answersMap);
                                
                                // Check if all questions are answered in a test lesson
                                if (details.lesson_type === 'test' && 
                                    lessonStartData.user_answers.length === fetchedQuestions.length) {
                                    // All questions answered in a test = test submitted
                                    setTestSubmitted(true);
                                    
                                    // Create typed test results
                                    const typedResults: TestResult[] = lessonStartData.user_answers.map(ans => ({
                                        question_id: ans.question_id,
                                        is_correct: ans.is_correct
                                    }));
                                    setTestResults(typedResults);
                                }
                                
                                // Find the first unanswered question
                                let foundUnanswered = false;
                                for (let i = 0; i < fetchedQuestions.length; i++) {
                                    if (!answersMap[fetchedQuestions[i].question_id]) {
                                        initialQuestionIndex = i;
                                        foundUnanswered = true;
                                        break;
                                    }
                                }
                                
                                // If all questions have answers, stay on the last one
                                if (!foundUnanswered && fetchedQuestions.length > 0) {
                                    initialQuestionIndex = fetchedQuestions.length - 1;
                                }
                            } else {
                                console.log("No existing answers found");
                            }
                        } else {
                            console.error("Invalid response from lesson/start: Missing progress data");
                            setPageError("Failed to start lesson: Invalid server response");
                        }
                    } catch (progressError) {
                        console.error("Error starting lesson:", progressError);
                        setPageError(`Error starting lesson: ${progressError instanceof Error ? progressError.message : 'Unknown error'}`);
                    }
                } else {
                    console.log("User not logged in, progress will not be tracked or loaded.");
                    // For non-logged in users, start at the beginning
                }
                setCurrentQuestionIndex(initialQuestionIndex);

            } catch (err) {
                console.error("Error fetching lesson data:", err);
                setPageError(err instanceof Error ? err.message : "Failed to load lesson data");
            } finally {
                setIsLoadingPageData(false);
            }
        };
        fetchData();
    }, [lessonId, currentUser, authLoading]); // Added currentUser and authLoading as dependencies

    useEffect(() => {
        // Hide success message after 5 seconds
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const navigateToQuestion = useCallback(async (index: number) => {
        if (index >= 0 && index < questions.length) {
            const currentQ = questions[currentQuestionIndex];
            const currentA = userAnswers[currentQ.question_id];

            // Submit answer for current question if it's a detect type and was active but not completed
            if (currentQ.question_type === 'detect' && !currentA && document.querySelector('.detect-question button:disabled')) { 
                // This is a heuristic: if a detect question's start button is disabled, it might be active.
                // A more robust way would be for DetectQuestionComponent to expose an isActive state or similar.
                // Or, if `useHandDetection` `isDetecting` state is true for the current question.
                // For now, this is a placeholder for that logic.
                // await handleAnswerSubmit(currentQ.question_id, '', false); // Submit as incomplete
            }
            setCurrentQuestionIndex(index);
        }
    }, [questions, currentQuestionIndex, userAnswers]);

    const handleOpenHint = () => {
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
            const currentQ = questions[currentQuestionIndex];
            setHintCharacterName(currentQ.question_target);
            setIsHintOpen(true);
        }
    };

    const handleCloseHint = () => {
        setIsHintOpen(false);
        setHintCharacterName(null);
    };
    
    const handleCompleteTest = async () => {
        if (!progressId) {
            setPageError("Cannot submit lesson: Progress ID is missing.");
            return;
        }
        if (!currentUser) {
            setPageError("Cannot submit lesson: User not logged in.");
            return;
        }

        setIsSubmittingLesson(true);
        setPageError(null);
        try {
            // For test lessons, calculate and show results
            if (isTestLesson) {
                // Create results array in the order of questions
                const results: TestResult[] = questions.map(q => ({
                    question_id: q.question_id,
                    is_correct: userAnswers[q.question_id]?.is_correct || false
                }));
                
                setTestResults(results);
                setTestSubmitted(true);
                setIsResultsPopupOpen(true);
            } else {
                // For non-test lessons, just show a success message
                alert("Lesson completed and submitted successfully!");
            }
        } catch (err) {
            console.error("Error submitting lesson:", err);
            setPageError(err instanceof Error ? err.message : 'Failed to submit lesson');
        } finally {
            setIsSubmittingLesson(false);
        }
    };

    if (authLoading || isLoadingPageData || !lessonDetails) return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 text-center mt-16">Loading lesson...</div>
        </>
    );
    if (authError) return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 text-center mt-16 text-red-500">Authentication Error: {authError}</div>
        </>
    );
    if (pageError) return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 text-center mt-16 text-red-500">Error: {pageError}</div>
        </>
    );
    if (questions.length === 0 && !isLoadingPageData) return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 text-center mt-16">No questions found for this lesson.</div>
        </>
    );
    if (questions.length === 0) return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 text-center mt-16">Preparing lesson content...</div>
        </>
    );

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswerData = userAnswers[currentQuestion.question_id];
    const currentLessonType = lessonDetails.lesson_type;
    const isTestLesson = currentLessonType === 'test';
    const canShowHint = !isTestLesson;

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
            <Navbar />
            
            <div className="flex flex-col flex-1 mt-16 overflow-hidden">
                <header className="px-4 py-3 bg-white dark:bg-gray-900 shadow-sm">
                    <h1 className="text-3xl font-bold text-center">{lessonDetails.name}</h1>
                    {!currentUser && <p className="text-sm text-center text-yellow-600">You are not logged in. Progress will not be saved.</p>}
                    {successMessage && (
                        <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md text-center">
                            {successMessage}
                        </div>
                    )}
                </header>

                <div className="flex flex-1 overflow-hidden">
                    <aside className="w-1/4 px-4 border-r overflow-y-auto bg-gray-50 dark:bg-gray-950">
                        <h2 className="text-xl font-semibold mb-3 sticky top-0 p-0 bg-gray-50 dark:bg-gray-950 py-1">Course Navigation</h2>
                        
                        {coursesWithLessons.map(course => (
                            <div key={course.course_id} className="mb-4">
                                <h3 className="font-semibold text-lg pl-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                    {course.course_name}
                                </h3>
                                <ul className="mt-2 space-y-1 pl-4">
                                    {course.course_lessons.map(lesson => (
                                        <li key={lesson.lesson_id}>
                                            <button 
                                                onClick={() => router.push(`/lessons/${lesson.lesson_id}`)}
                                                className={`w-full text-left p-2 rounded text-sm
                                                    ${lesson.lesson_id === lessonId 
                                                        ? 'bg-blue-500 text-white' 
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                            >
                                                {lesson.lesson_name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </aside>

                    <main className="w-3/4 p-4 flex-1 overflow-hidden flex flex-col">
                        <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-lg flex-1 overflow-hidden">
                            {currentQuestion && (
                                <QuestionDisplay 
                                    question={currentQuestion} 
                                    currentAnswerData={currentAnswerData} 
                                    onAnswerSubmit={handleAnswerSubmit}
                                    lessonType={currentLessonType}
                                    isTestSubmitted={testSubmitted}
                                />
                            )}
                        </div>
                    </main>
                </div>

                <footer className="p-4 border-t flex justify-between items-center bg-white dark:bg-gray-900 z-10">
                    {/* Question navigation boxes on the left */}
                    <div className="flex flex-wrap gap-2">
                        {questions.map((q, index) => {
                            // Determine button color based on answer status
                            let buttonClass = "w-10 h-10 flex items-center justify-center rounded-lg";
                            
                            // In test mode, only show colors after submission
                            if (isTestLesson && !testSubmitted) {
                                // In test mode before submission, only show attempted/not attempted
                                if (userAnswers[q.question_id]) {
                                    // Question has been answered but don't show if correct/incorrect
                                    buttonClass += " bg-blue-200 text-blue-700"; // Attempted but result hidden
                                } else if (index === currentQuestionIndex) {
                                    buttonClass += " bg-blue-500 text-white"; // Current question
                                } else {
                                    buttonClass += " bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"; // Unanswered
                                }
                            } else {
                                // Normal mode or test mode after submission - show actual results
                                if (userAnswers[q.question_id]?.is_correct === true) {
                                    buttonClass += " bg-green-500 text-white"; // Correct answer
                                } else if (userAnswers[q.question_id]?.is_correct === false) {
                                    buttonClass += " bg-red-500 text-white"; // Wrong answer
                                } else if (index === currentQuestionIndex) {
                                    buttonClass += " bg-blue-500 text-white"; // Current question
                                } else {
                                    buttonClass += " bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"; // Unanswered
                                }
                            }
                            
                            return (
                                <button 
                                    key={q.question_id}
                                    onClick={() => navigateToQuestion(index)}
                                    className={buttonClass}
                                    aria-label={`Question ${index + 1}`}
                                    aria-current={index === currentQuestionIndex ? "true" : "false"}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Action buttons on the right */}
                    <div className="flex items-center space-x-3">
                        {canShowHint && (
                            <button 
                                onClick={handleOpenHint}
                                className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500"
                            >
                                Hint
                            </button>
                        )}
                        
                        {isTestLesson && currentQuestionIndex === questions.length - 1 && (
                            <button 
                                onClick={handleCompleteTest}
                                disabled={isSubmittingLesson}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {testSubmitted ? 'Show Results' : isSubmittingLesson ? 'Submitting...' : 'Submit Test'}
                            </button>
                        )}
                        
                        {lessonDetails?.next_lesson_id && (
                            <button 
                                onClick={() => router.push(`/lessons/${lessonDetails.next_lesson_id}`)}
                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                            >
                                Next Lesson
                            </button>
                        )}
                    </div>
                </footer>
            </div>

            {isHintOpen && hintCharacterName && (
                <HintPopup 
                    isOpen={isHintOpen} 
                    characterName={hintCharacterName} 
                    onClose={handleCloseHint} 
                />
            )}

            {isTestLesson && (
                <TestResultsModal
                    isOpen={isResultsPopupOpen}
                    onClose={() => setIsResultsPopupOpen(false)}
                    results={testResults}
                    totalQuestions={questions.length}
                />
            )}
        </div>
    );
};

export default LessonPage; 