import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Question } from '../../../models/questions';
import { useASLCharacters } from '../../contexts/ASLCharacterContext';

interface ChoiceQuestionComponentProps {
    question: Question;
    currentAnswerData?: { user_choice: string; is_correct: boolean };
    onAnswerSubmit: (questionId: string, userAnswer: string) => Promise<void>;
}

const ChoiceQuestionComponent: React.FC<ChoiceQuestionComponentProps> = ({ 
    question, 
    currentAnswerData, 
    onAnswerSubmit 
}) => {
    const { getCharacter, isLoading: aslLoading, error: aslError } = useASLCharacters();
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ choice: string; is_correct: boolean } | null>(null);

    const questionTargetCharacter = getCharacter(question.question_target);
    const choiceCharacters = question.question_choice.split('').map(char => getCharacter(char));

    // Reset state when question changes
    useEffect(() => {
        setSelectedChoice(null);
        setFeedback(null);
    }, [question.question_id]);

    // Set initial state from currentAnswerData only if it matches the current question
    useEffect(() => {
        if (currentAnswerData) {
            setSelectedChoice(currentAnswerData.user_choice);
            setFeedback({ 
                choice: currentAnswerData.user_choice, 
                is_correct: currentAnswerData.is_correct 
            });
        }
    }, [currentAnswerData]);

    const handleChoiceClick = async (choice: string) => {
        // Allow reattempting even after getting it wrong
        setSelectedChoice(choice);
        
        try {
            await onAnswerSubmit(question.question_id, choice);
            // Check if it's the right answer
            const isCorrect = choice === question.question_target;
            setFeedback({ choice, is_correct: isCorrect });
        } catch (err) {
            console.error("Error submitting answer:", err);
        }
    };

    const handleRetry = () => {
        setSelectedChoice(null);
        setFeedback(null);
    };

    if (aslLoading) {
        return <div className="p-4 text-center">Loading character data...</div>;
    }

    if (aslError) {
        return <div className="p-4 text-center text-red-500">Error loading character data: {aslError}</div>;
    }

    if (question.question_type === 'choice_to_char' && !questionTargetCharacter) {
        return <div className="p-4 text-center text-red-500">Target character data not found for: {question.question_target}</div>;
    }

    if (question.question_type === 'choice_to_image' && choiceCharacters.some(c => !c)) {
        return <div className="p-4 text-center text-red-500">Not all choice character images are available.</div>;
    }

    const getButtonClass = (choiceValue: string) => {
        const baseClass = "p-3 m-2 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-150 w-full md:w-auto md:min-w-[100px]";
        
        if (!selectedChoice) return `${baseClass} bg-white hover:bg-gray-100`; // Neutral state
        
        const isSelected = selectedChoice === choiceValue;
        
        if (isSelected && feedback) {
            // Show correct/incorrect for the selected choice only
            return `${baseClass} ${feedback.is_correct ? 'bg-green-500 text-white ring-green-600' : 'bg-red-500 text-white ring-red-600'}`;
        }
        
        if (isSelected && !feedback) {
            // Immediate selection before response
            return `${baseClass} bg-blue-200 ring-blue-400`;
        }

        return `${baseClass} bg-white hover:bg-gray-100`;
    };

    return (
        <div className="choice-question p-4 space-y-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">
                {question.question_type === 'choice_to_char' 
                    ? "Which character does this sign represent?"
                    : `Which sign represents the character: "${question.question_target}"?`}
            </h3>

            {question.question_type === 'choice_to_char' && questionTargetCharacter && (
                <div className="mb-6 flex justify-center items-center relative h-64 md:h-72">
                    <Image 
                        src={`/asl_example/${questionTargetCharacter.char_name}.jpg`} 
                        alt={`Sign for ${questionTargetCharacter.char_name}`}
                        layout="intrinsic"
                        width={200}
                        height={200}
                        className="border-2 border-gray-300 rounded-lg p-1 bg-gray-50 shadow-md object-contain"
                    />
                </div>
            )}

            <div className="choices-grid grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {question.question_choice.split('').map((charChoice, index) => {
                    const choiceData = choiceCharacters[index];
                    const choiceImagePath = choiceData ? `/asl_example/${choiceData.char_name}.jpg` : null;
                    return (
                        <button
                            key={charChoice}
                            onClick={() => handleChoiceClick(charChoice)}
                            disabled={selectedChoice === charChoice && feedback?.is_correct === true} // Only disable when correct
                            className={`${getButtonClass(charChoice)} flex flex-col justify-center items-center p-2`}
                        >
                            {question.question_type === 'choice_to_image' && choiceImagePath ? (
                                <div className="relative w-24 h-24 md:w-32 md:h-32">
                                    <Image 
                                        src={choiceImagePath} 
                                        alt={`Sign for ${charChoice}`}
                                        layout="fill"
                                        objectFit="contain"
                                        className="rounded"
                                    />
                                </div>
                            ) : (
                                <span className="text-2xl font-bold">{charChoice}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {feedback && (
                <div className="mt-6 flex flex-col items-center">
                    <div className={`p-3 rounded-lg text-lg font-medium ${feedback.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {feedback.is_correct 
                            ? 'Correct!' 
                            : 'Incorrect. Try again!'}
                    </div>
                    
                    {!feedback.is_correct && (
                        <button
                            onClick={handleRetry}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChoiceQuestionComponent; 