import React, { useState, useEffect } from 'react';
import { Question } from '../../../models/questions';
import HandDetectionCamera from '../HandDetectionCamera';

interface DetectQuestionComponentProps {
    question: Question;
    onAnswerSubmit: (questionId: string, userAnswer: string, isCorrect?: boolean) => Promise<void>;
    currentAnswerData?: { user_choice: string; is_correct: boolean } | null;
     
    lessonType?: string;
     
    isTestSubmitted?: boolean;
}

// Increase threshold to match detecting mode for more reliable detection
const CONSECUTIVE_THRESHOLD = 6;

const DetectQuestionComponent: React.FC<DetectQuestionComponentProps> = ({ 
    question, 
    onAnswerSubmit,
    currentAnswerData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lessonType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isTestSubmitted
}) => {
    const [currentDetectedSign, setCurrentDetectedSign] = useState<string | null>(null);
    const [consecutiveCount, setConsecutiveCount] = useState<number>(0);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
    const [isDetecting, setIsDetecting] = useState<boolean>(false);
    const [hasStartedAttempt, setHasStartedAttempt] = useState<boolean>(false);
    // Add a mount key to force remounting of camera component
    const [cameraKey, setCameraKey] = useState<number>(0);
    
    // New state for sequence handling
    const [targetSequence, setTargetSequence] = useState<string[]>([]);
    const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
    const [completedChars, setCompletedChars] = useState<string[]>([]);
    
    // Check if the question was already correctly answered in a previous session
    const isAlreadyCorrect = currentAnswerData?.is_correct === true;
    
    // Initialize the target sequence when the question changes
    useEffect(() => {
        // Split the target into individual characters
        const chars = question.question_target.split('');
        setTargetSequence(chars);
        setCurrentCharIndex(0);
        setCompletedChars([]);
        console.log(`Target sequence set: ${chars.join(', ')}`);
    }, [question.question_target]);
    
    // Current character we're trying to detect
    const currentTargetChar = targetSequence[currentCharIndex] || '';
    
    // Handle detection results using the consecutive threshold approach
    const handleDetectionResult = async (prediction: string) => {
        console.log(`Detection result: ${prediction}, Current target: ${currentTargetChar}, Index: ${currentCharIndex}/${targetSequence.length}, Count: ${consecutiveCount}`);
        
        // Skip if already submitted or already correct
        if (hasSubmitted || isAlreadyCorrect) {
            console.log("Skipping detection - already submitted or correct");
            return;
        }
        
        // Mark the question as attempted if this is the first detection
        if (!hasStartedAttempt) {
            console.log(`First detection, marking question ${question.question_id} as attempted`);
            setHasStartedAttempt(true);
            try {
                // Mark as incorrect initially
                await onAnswerSubmit(question.question_id, "", false);
            } catch (err) {
                console.error("Error marking question as attempted:", err);
            }
        }
        
        setCurrentDetectedSign(prediction);
        
        // Check if the prediction matches the current character in sequence
        if (prediction === currentTargetChar) {
            // Increase consecutive count for correct predictions
            const newCount = consecutiveCount + 1;
            console.log(`Correct sign detected! Increasing count to ${newCount}/${CONSECUTIVE_THRESHOLD}`);
            setConsecutiveCount(newCount);
            
            // Check if we've reached the threshold for the current character
            if (newCount >= CONSECUTIVE_THRESHOLD) {
                // Successfully detected the current character
                const newCompletedChars = [...completedChars, currentTargetChar];
                setCompletedChars(newCompletedChars);
                
                // Check if we've completed the whole sequence
                if (currentCharIndex + 1 >= targetSequence.length) {
                    // Completed the entire sequence!
                    console.log(`Detection successful for full sequence "${question.question_target}", marking as correct`);
                    setFeedbackMessage(`Correct! You signed "${question.question_target}" successfully.`);
                    try {
                        // Update the answer as correct in the backend
                        await onAnswerSubmit(question.question_id, question.question_target, true);
                        setHasSubmitted(true);
                        setIsDetecting(false);
                    } catch (err) {
                        console.error("Error marking question as correct:", err);
                    }
                } else {
                    // Move to the next character in the sequence
                    const nextIndex = currentCharIndex + 1;
                    console.log(`Moving to next character: ${targetSequence[nextIndex]} (index: ${nextIndex})`);
                    setCurrentCharIndex(nextIndex);
                    setConsecutiveCount(0);
                    setFeedbackMessage(`Great! "${currentTargetChar}" detected. Now sign "${targetSequence[nextIndex]}"`);
                }
            }
        } else {
            // Reset consecutive count for incorrect predictions
            console.log(`Incorrect sign detected: ${prediction}, expected: ${currentTargetChar}, resetting count`);
            setConsecutiveCount(0);
        }
    };

    // Complete reset of all component state
    const resetComponentState = () => {
        console.log("Full reset of component state");
        setConsecutiveCount(0);
        setCurrentDetectedSign(null);
        setFeedbackMessage('Point your hand towards the camera and sign the character.');
        setHasSubmitted(false);
        setHasStartedAttempt(false);
        setCurrentCharIndex(0);
        setCompletedChars([]);
        // Increment camera key to force remounting
        setCameraKey(prev => prev + 1);
    };

    // First completely stop detection, then restart with a slight delay
    const restartDetection = async () => {
        // First stop detection
        setIsDetecting(false);
        
        // Use a timeout to ensure React has time to unmount the camera component
        setTimeout(() => {
            resetComponentState();
            setIsDetecting(true);
        }, 100);
    };

    // Handle start button click
    const handleStart = async () => {
        console.log("Starting detection from handleStart");
        resetComponentState();
        setIsDetecting(true);
    };

    // Handle try again button click
    const handleTryAgain = async () => {
        console.log("Retrying detection from handleTryAgain");
        restartDetection();
    };

    // Handle stop button click
    const handleStop = async () => {
        setIsDetecting(false);
        setFeedbackMessage('Detection stopped.');
        
        if (!hasSubmitted && hasStartedAttempt) {
            console.log(`Detection stopped for question ${question.question_id}, marking as incorrect`);
            try {
                // Submit the current state as incorrect if user stops manually after starting
                await onAnswerSubmit(question.question_id, currentDetectedSign || '', false);
                setHasSubmitted(true);
            } catch (err) {
                console.error("Error marking question as incorrect:", err);
            }
        }
    };
    
    // Reset component when question changes
    useEffect(() => {
        console.log(`Question changed to ${question.question_id}, resetting component`);
        resetComponentState();
        setIsDetecting(false);
    }, [question.question_id]);
    
    // If the question was already correctly answered, show a success message
    useEffect(() => {
        if (isAlreadyCorrect) {
            console.log(`Question ${question.question_id} was already correctly answered`);
            setFeedbackMessage(`You've already correctly signed "${question.question_target}".`);
            setHasSubmitted(true);
        }
    }, [isAlreadyCorrect, question.question_target, question.question_id]);

    // Calculate progress percentage for the entire sequence
    const totalSteps = targetSequence.length * CONSECUTIVE_THRESHOLD;
    const completedSteps = completedChars.length * CONSECUTIVE_THRESHOLD + consecutiveCount;
    const progressPercentage = Math.min((completedSteps / totalSteps) * 100, 100);

    return (
        <div className="detect-question w-full h-full flex flex-col">
            <h3 className="text-2xl font-semibold text-center mb-4">
                Sign the sequence: <span className="text-blue-600">&ldquo;{question.question_target}&rdquo;</span>
            </h3>
            
            <div className="relative flex-1 w-full min-h-[400px]">
                {isDetecting ? (
                    <div className="relative w-full h-full">
                        <HandDetectionCamera
                            key={`camera-${cameraKey}-${question.question_id}`}
                            onDetectionResult={handleDetectionResult}
                            consecutiveCount={consecutiveCount}
                            consecutiveThreshold={CONSECUTIVE_THRESHOLD}
                            className="w-full h-full"
                        />
                        
                        {/* Sequence indicator */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg">
                            {targetSequence.map((char, index) => (
                                <span 
                                    key={index} 
                                    className={`mx-1 text-2xl ${
                                        index < currentCharIndex 
                                            ? 'text-green-400' 
                                            : index === currentCharIndex 
                                                ? 'text-yellow-400 font-bold' 
                                                : 'text-gray-400'
                                    }`}
                                >
                                    {char}
                                </span>
                            ))}
                        </div>
                        
                        {/* Current character instruction */}
                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-1 rounded-lg">
                            <p className="text-sm">Now signing: <span className="font-bold text-yellow-400">{currentTargetChar}</span></p>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="absolute bottom-16 left-2 right-2">
                            <div className="flex justify-between text-xs text-white mb-1">
                                <span className="bg-black/50 p-1 rounded">
                                    Character Progress: {consecutiveCount}/{CONSECUTIVE_THRESHOLD}
                                </span>
                                <span className="bg-black/50 p-1 rounded">
                                    Sequence: {currentCharIndex + 1}/{targetSequence.length}
                                </span>
                            </div>
                            
                            {/* Character progress */}
                            <div className="h-2 bg-gray-700/70 rounded-full overflow-hidden mb-2">
                                <div 
                                    className="h-full bg-yellow-500 transition-all duration-300 ease-in-out"
                                    style={{ width: `${Math.min((consecutiveCount / CONSECUTIVE_THRESHOLD) * 100, 100)}%` }}
                                />
                            </div>
                            
                            {/* Overall sequence progress */}
                            <div className="h-3 bg-gray-700/70 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                        
                        {/* Stop button */}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                            <button 
                                onClick={handleStop}
                                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-150"
                            >
                                Stop Detection
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full bg-gray-800 rounded-lg shadow-md flex flex-col items-center justify-center relative">
                        <p className="text-gray-400 mb-8">Camera will appear here when detection starts.</p>
                        
                        {feedbackMessage && (
                            <div className={`mx-4 p-3 rounded-lg ${
                                hasSubmitted && feedbackMessage.includes('Correct') 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/70 dark:text-green-300' 
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/70 dark:text-yellow-300'
                            }`}>
                                {feedbackMessage}
                            </div>
                        )}
                        
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                            <button 
                                onClick={hasSubmitted ? handleTryAgain : handleStart}
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-150"
                            >
                                {hasSubmitted ? 'Try Again' : 'Start Detection'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetectQuestionComponent; 