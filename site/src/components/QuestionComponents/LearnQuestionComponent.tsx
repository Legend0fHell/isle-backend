import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import next/image
import { Question } from '../../../models/questions';
import { useASLCharacters } from '../../contexts/ASLCharacterContext'; // Adjusted path

interface LearnQuestionComponentProps {
    question: Question;
    onAnswerSubmit: (questionId: string, userAnswer: string) => Promise<void>;
    currentAnswerData?: { user_choice: string; is_correct: boolean } | null;
     
    lessonType?: string;
     
    isTestSubmitted?: boolean;
}

const LearnQuestionComponent: React.FC<LearnQuestionComponentProps> = ({ 
    question, 
    onAnswerSubmit,
    currentAnswerData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lessonType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isTestSubmitted
}) => {
    const { getCharacter, isLoading: aslLoading, error: aslError } = useASLCharacters();
    const characterData = getCharacter(question.question_target);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    
    // Check if the question has already been answered
    const isAlreadyAnswered = !!currentAnswerData;

    // Reset hasSubmitted state when question changes
    useEffect(() => {
        setHasSubmitted(false);
    }, [question.question_id]);

    const handleReviewed = async () => {
        await onAnswerSubmit(question.question_id, question.question_target);
        setHasSubmitted(true);
    };

    if (aslLoading) {
        return <div className="p-4 text-center">Loading character information...</div>;
    }

    if (aslError) {
        return <div className="p-4 text-center text-red-500">Error loading character: {aslError}</div>;
    }

    if (!characterData) {
        return <div className="p-4 text-center text-red-500">Character data not found for: {question.question_target}</div>;
    }

    // Helper to extract YouTube video ID from URL
    const getYouTubeVideoId = (url: string | undefined): string | null => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeVideoId(characterData.char_tutorial_url);
    const localImagePath = question.question_target ? `/asl_example/${question.question_target}.jpg` : null;
    
    // Define a consistent height for both video and image
    const mediaHeight = "h-60";

    return (
        <div className="learn-question">
            <h2 className="text-3xl font-bold text-center mb-6">Learn the Sign: <span className="text-blue-600">{characterData.char_name}</span></h2>
            
            <div className="flex flex-col space-y-4">
                {/* Media section - Video and Image side by side */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    {/* Video Tutorial */}
                    {videoId && (
                        <div className={`video-container ${mediaHeight} bg-gray-200 rounded-lg shadow-md overflow-hidden`}>
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&rel=0&controls=0`}
                                title={`YouTube video player for ${characterData.char_name}`} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                    {!videoId && characterData.char_tutorial_url && (
                        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
                            <p>Video link provided, but it doesn&apos;t seem to be a valid YouTube URL: <a href={characterData.char_tutorial_url} target="_blank" rel="noopener noreferrer" className="underline">{characterData.char_tutorial_url}</a></p>
                        </div>
                    )}

                    {/* Image */}
                    {localImagePath && (
                        <div className={`image-container ${mediaHeight} bg-gray-100 rounded-lg shadow-md flex justify-center items-center relative w-full`}>
                            <Image 
                                src={localImagePath} 
                                alt={`Sign for ${question.question_target}`}
                                layout="intrinsic"
                                width={200} 
                                height={200} 
                                className="object-contain rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Text Tutorial - Full width */}
                {characterData.char_tutorial_text && (
                    <div className="text-guide bg-gray-100 p-4 rounded-lg shadow-md w-full">
                        <h4 className="text-lg font-semibold mb-2">How to make the sign:</h4>
                        <p className="text-gray-700 whitespace-pre-line">{characterData.char_tutorial_text}</p>
                    </div>
                )}
            </div>

            {/* Only show button if not already answered and not just submitted */}
            {!isAlreadyAnswered && !hasSubmitted && (
                <div className="mt-8 text-center">
                    <button 
                        onClick={handleReviewed}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition duration-150 text-lg"
                    >
                        I Understand / Mark as Reviewed
                    </button>
                </div>
            )}
        </div>
    );
};

export default LearnQuestionComponent; 