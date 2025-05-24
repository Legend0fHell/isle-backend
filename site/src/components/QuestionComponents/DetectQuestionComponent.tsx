import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from '../../../models/questions';
import { useHandDetection } from '../../hooks/useHandDetection'; // Import the new hook
import { X } from 'lucide-react'; // For WebSocket error popup

interface DetectQuestionComponentProps {
    question: Question;
    onAnswerSubmit: (questionId: string, userAnswer: string, isCorrect?: boolean) => Promise<void>;
}

const DETECT_SUCCESS_THRESHOLD = 3; // e.g., 3 consecutive correct detections
// Confidence threshold is now managed within the ML model or implicitly by its output
// if the hook's onDetectionResult only provides the final prediction.

const DetectQuestionComponent: React.FC<DetectQuestionComponentProps> = ({ 
    question, 
    onAnswerSubmit 
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); 

    const [currentDetectedSign, setCurrentDetectedSign] = useState<string | null>(null);
    const [correctDetectionsCount, setCorrectDetectionsCount] = useState<number>(0);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false); // Prevents multiple submissions

    const handleDetectionResult = useCallback((prediction: string) => {
        if (hasSubmitted) return;
        setCurrentDetectedSign(prediction);
        if (prediction === question.question_target) {
            setCorrectDetectionsCount(prev => prev + 1);
        } else {
            setCorrectDetectionsCount(0); // Reset if detection is wrong
        }
    }, [question.question_target, hasSubmitted]);

    const {
        startDetection: hookStartDetection,
        stopDetection: hookStopDetection,
        isCameraReady,
        isDetecting, // This is the isDetecting from the hook, representing camera/mediapipe activity
        cameraError,
        isConnectedToWebSocket,
        showWebSocketError,
        reconnectWebSocket,
        closeWebSocketConnectionError
    } = useHandDetection({
        videoRef,
        canvasRef,
        onDetectionResult: handleDetectionResult,
        enableDrawing: true, // Enable drawing landmarks on canvas
    });

    useEffect(() => {
        if (hasSubmitted) return;
        if (correctDetectionsCount >= DETECT_SUCCESS_THRESHOLD) {
            setFeedbackMessage(`Correct! You signed "${question.question_target}".`);
            onAnswerSubmit(question.question_id, question.question_target, true);
            setHasSubmitted(true);
            hookStopDetection(); // Stop camera and processing via hook
        }
    }, [correctDetectionsCount, question, onAnswerSubmit, hookStopDetection, hasSubmitted]);

    const handleStart = () => {
        setFeedbackMessage('Starting detection... Point your hand towards the camera.');
        setCorrectDetectionsCount(0);
        setCurrentDetectedSign(null);
        setHasSubmitted(false);
        hookStartDetection();
    };

    const handleStop = () => {
        hookStopDetection();
        setFeedbackMessage('Detection stopped.');
        if (!hasSubmitted) {
            // Submit last stable or empty if user stops manually before success
            onAnswerSubmit(question.question_id, currentDetectedSign || '', false);
            setHasSubmitted(true); // Mark as submitted to prevent further auto-submissions on unmount
        }
    };
    
    // Cleanup on unmount if detection was active and no final answer submitted
    useEffect(() => {
        return () => {
            if (isDetecting && !hasSubmitted) {
                // This logic is tricky: if component unmounts while detecting but before success/manual stop
                // it means the lesson page navigated away.
                // We submit the last detected sign (if any) as incorrect.
                onAnswerSubmit(question.question_id, currentDetectedSign || '', false);
            }
            // Ensure hook's cleanup (stopDetection) is called if it hasn't been already
            // The hook itself has its own cleanup, but calling stop here ensures it if the component unmounts abruptly
            if(isDetecting) hookStopDetection(); 
        };
     
    }, [isDetecting, hasSubmitted, currentDetectedSign, question.question_id, onAnswerSubmit, hookStopDetection]);

    // Display camera error from hook
    useEffect(() => {
        if (cameraError) {
            setFeedbackMessage(`Camera Error: ${cameraError}`);
        }
    }, [cameraError]);


    return (
        <div className="detect-question p-4 space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-4">Sign the character: <span className="text-blue-600">{question.question_target}</span></h3>
            
            {/* WebSocket Error Popup */}
            {showWebSocketError && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-md rounded-xl bg-red-50 p-6 shadow-2xl">
                        <button
                            onClick={closeWebSocketConnectionError}
                            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-red-100"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button>
                        <h3 className="mb-4 text-xl font-semibold text-red-700">Connection Lost</h3>
                        <p className="mb-4 text-red-600">
                            Connection to the sign recognition service lost. Please check your internet.
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={reconnectWebSocket}
                                className="px-4 py-2 text-white bg-red-700 rounded-lg shadow-md hover:bg-red-800"
                            >
                                Reconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="webcam-feed-container bg-gray-800 aspect-video rounded-lg shadow-md flex items-center justify-center relative">
                    <video ref={videoRef} className="w-full h-full object-cover rounded-lg" autoPlay playsInline muted />
                    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
                    {!isCameraReady && !cameraError && (
                        <p className="absolute text-gray-400">{isDetecting ? 'Initializing Camera...' : 'Camera feed will appear here.'}</p>
                    )}
                </div>

                <div className="detection-info space-y-3 p-4 bg-gray-100 rounded-lg shadow">
                    <p className="text-lg">Target Sign: <span className="font-bold text-xl text-blue-700">{question.question_target}</span></p>
                    <p className="text-lg">Your Current Sign: <span className="font-bold text-xl text-green-700">{currentDetectedSign || 'N/A'}</span></p>
                    {/* Confidence display removed as it's not directly available from the simplified onDetectionResult for now */}
                    <div className="h-6 bg-gray-300 rounded-full overflow-hidden my-2">
                        <div 
                            className="h-full bg-green-500 transition-all duration-300 ease-linear"
                            style={{ width: `${Math.min((correctDetectionsCount / DETECT_SUCCESS_THRESHOLD) * 100, 100)}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600">Keep signing <span className="font-semibold">&quot;{question.question_target}&quot;</span> steadily ({correctDetectionsCount}/{DETECT_SUCCESS_THRESHOLD} counts).</p>
                    <p className="text-sm text-gray-500">WebSocket: {isConnectedToWebSocket ? <span className="text-green-600">Connected</span> : <span className="text-red-600">Disconnected</span>}</p>
                </div>
            </div>

            {feedbackMessage && (
                <p className={`text-center text-md mt-4 p-2 rounded ${cameraError ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{feedbackMessage}</p>
            )}

            <div className="mt-6 text-center space-x-4">
                {(!isDetecting && !isCameraReady && !hasSubmitted) || (hasSubmitted) ? (
                    <button 
                        onClick={handleStart}
                        disabled={!isConnectedToWebSocket} // Disable if WebSocket is not connected
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {hasSubmitted ? 'Try Again' : 'Start Detection'}
                    </button>
                ) : (
                    <button 
                        onClick={handleStop}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-150"
                    >
                        Stop Detection
                    </button>
                )}
            </div>
        </div>
    );
};

export default DetectQuestionComponent; 