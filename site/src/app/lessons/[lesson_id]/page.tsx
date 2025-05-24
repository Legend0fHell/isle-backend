'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Question, getLessonQuestions, checkQuestionAnswer } from '../../../../models/questions'; 
import { getRecentLessonProgress, LessonProgressResponse, completeLessonProgress } from '../../../../models/progress'; 
import { getLessonDetails, LessonDetails } from '../../../../models/course'; // Removed LessonType as it's unused
// User model import is no longer needed here as it comes from AuthContext
import QuestionDisplay from '../../../components/QuestionComponents/QuestionDisplay';
import HintPopup from '../../../components/HintPopup';
import { useAuth } from '../../../contexts/AuthContext'; // Import useAuth

interface UserAnswersMap {
    [questionId: string]: { user_choice: string; is_correct: boolean };
}

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
    
    const [isHintOpen, setIsHintOpen] = useState(false);
    const [hintCharacterName, setHintCharacterName] = useState<string | null>(null);
    const [isSubmittingLesson, setIsSubmittingLesson] = useState(false); // New state for submission loading
    // currentLessonType will now come from lessonDetails.lesson_type

    const handleAnswerSubmit = useCallback(async (questionId: string, userAnswer: string, isCorrectProvided?: boolean) => {
        if (!currentUser || !currentUser.user_id) {
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
            setPageError("Progress ID not found. Cannot submit answer.");
            return;
        }

        try {
            const isCorrect = isCorrectProvided !== undefined ? isCorrectProvided : await checkQuestionAnswer(progressId, questionId, userAnswer);
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
                // Fetch lesson details first
                const details = await getLessonDetails(lessonId);
                setLessonDetails(details);

                const fetchedQuestions = await getLessonQuestions(lessonId);
                setQuestions(fetchedQuestions);
                
                let initialQuestionIndex = 0;
                if (currentUser && currentUser.user_id) {
                    const recentProgress: LessonProgressResponse = await getRecentLessonProgress(currentUser.user_id, lessonId);
                    if (recentProgress && recentProgress.progress_id) {
                        setProgressId(recentProgress.progress_id);
                        const answersMap: UserAnswersMap = {};
                        recentProgress.questions.forEach(ans => {
                            answersMap[ans.question_id] = { user_choice: ans.user_choice, is_correct: ans.is_correct };
                        });
                        setUserAnswers(answersMap);
                        
                        for (let i = 0; i < fetchedQuestions.length; i++) {
                            if (!answersMap[fetchedQuestions[i].question_id]) {
                                initialQuestionIndex = i;
                                break;
                            }
                            // If all questions have answers, stay on the last one or first based on preference
                            if (i === fetchedQuestions.length - 1) initialQuestionIndex = i; 
                        }
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
    }, [questions, currentQuestionIndex, userAnswers]); // Removed handleAnswerSubmit from deps to avoid loops

    const handleNextQuestion = () => {
        navigateToQuestion(currentQuestionIndex + 1);
    };

    const handlePrevQuestion = () => {
        navigateToQuestion(currentQuestionIndex - 1);
    };

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
            await completeLessonProgress(progressId);
            // Handle successful submission
            // For example, show a success message, navigate away, or update UI
            alert("Lesson completed and submitted successfully!"); 
            // Optionally, navigate to a results page or back to courses
            // router.push('/courses'); 
        } catch (err) {
            console.error("Error submitting lesson:", err);
            setPageError(err instanceof Error ? err.message : 'Failed to submit lesson');
        } finally {
            setIsSubmittingLesson(false);
        }
    };

    if (authLoading || isLoadingPageData || !lessonDetails) return <div className="container mx-auto p-4 text-center">Loading lesson...</div>;
    if (authError) return <div className="container mx-auto p-4 text-center text-red-500">Authentication Error: {authError}</div>;
    if (pageError) return <div className="container mx-auto p-4 text-center text-red-500">Error: {pageError}</div>;
    if (questions.length === 0 && !isLoadingPageData) return <div className="container mx-auto p-4 text-center">No questions found for this lesson.</div>;
    if (questions.length === 0) return <div className="container mx-auto p-4 text-center">Preparing lesson content...</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswerData = userAnswers[currentQuestion.question_id];
    const currentLessonType = lessonDetails.lesson_type;
    const canShowHint = currentLessonType === 'learn' || currentLessonType === 'practice';
    const isTestLesson = currentLessonType === 'test';

    return (
        <div className="container mx-auto p-4 flex flex-col min-h-screen">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-center">{lessonDetails.name} (Type: {currentLessonType})</h1>
                {currentUser && progressId && <p className="text-sm text-center text-gray-600">Progress ID: {progressId}</p>}
                {!currentUser && <p className="text-sm text-center text-yellow-600">You are not logged in. Progress will not be saved.</p>}
            </header>

            <div className="flex flex-1">
                <aside className="w-1/4 pr-4 border-r overflow-y-auto" style={{maxHeight: 'calc(100vh - 200px)'}}>
                    <h2 className="text-xl font-semibold mb-3 sticky top-0 bg-white py-2">Questions</h2>
                    <ul className="space-y-2">
                        {questions.map((q, index) => (
                            <li key={q.question_id}>
                                <button 
                                    onClick={() => navigateToQuestion(index)}
                                    className={`w-full text-left p-2 rounded ${index === currentQuestionIndex ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'} ${userAnswers[q.question_id]?.is_correct === true ? 'border-l-4 border-green-500' : userAnswers[q.question_id]?.is_correct === false ? 'border-l-4 border-red-500' : 'border-l-4 border-transparent'}`}
                                >
                                    Question {index + 1}{userAnswers[q.question_id]?.is_correct === true ? " ✓" : userAnswers[q.question_id]?.is_correct === false ? " ✗" : ""}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="w-3/4 pl-4 flex-1 flex flex-col">
                    <div className="bg-white shadow p-6 rounded-lg flex-1">
                        {currentQuestion && (
                            <QuestionDisplay 
                                question={currentQuestion} 
                                currentAnswerData={currentAnswerData} 
                                onAnswerSubmit={handleAnswerSubmit} 
                            />
                        )}
                    </div>
                </main>
            </div>

            <footer className="mt-6 p-4 border-t flex justify-between items-center sticky bottom-0 bg-white z-10">
                <button 
                    onClick={handlePrevQuestion} 
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                
                <div className="flex items-center"> {/* Group Hint, Submit, and Next Lesson buttons */} 
                    {canShowHint && (
                        <button 
                            onClick={handleOpenHint}
                            className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 mr-2"
                        >
                            Hint
                        </button>
                    )}
                    {isTestLesson && currentQuestionIndex === questions.length - 1 && (
                         <button 
                            onClick={handleCompleteTest}
                            disabled={isSubmittingLesson}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-75 disabled:cursor-not-allowed mr-2"
                        >
                            {isSubmittingLesson ? 'Submitting...' : 'Submit Lesson'}
                        </button>
                    )}
                    {/* "Next Lesson" button - shown if next_lesson_id exists */} 
                    {lessonDetails?.next_lesson_id && (
                        <button 
                            onClick={() => router.push(`/lessons/${lessonDetails.next_lesson_id}`)}
                            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                            Next Lesson
                        </button>
                    )}
                </div>

                <button 
                    onClick={handleNextQuestion} 
                    disabled={currentQuestionIndex === questions.length - 1} // Simplified: Next Lesson button handles moving to next lesson
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Next Question
                </button>
            </footer>

            {isHintOpen && hintCharacterName && (
                <HintPopup 
                    isOpen={isHintOpen} 
                    characterName={hintCharacterName} 
                    onClose={handleCloseHint} 
                />
            )}
        </div>
    );
};

export default LessonPage; 