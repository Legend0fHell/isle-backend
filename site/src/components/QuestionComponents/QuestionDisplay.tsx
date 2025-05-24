import React from 'react';
import { Question } from '../../../models/questions';
import LearnQuestionComponent from './LearnQuestionComponent';
import ChoiceQuestionComponent from './ChoiceQuestionComponent';
import DetectQuestionComponent from './DetectQuestionComponent';
// Placeholder imports for specific question type components
// import DetectQuestionComponent from './DetectQuestionComponent';

interface QuestionDisplayProps {
    question: Question;
    currentAnswerData?: { user_choice: string; is_correct: boolean };
    onAnswerSubmit: (questionId: string, userAnswer: string, isCorrect?: boolean) => Promise<void>;
    // lessonType: string; // To be added later for hint visibility logic
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
    question, 
    currentAnswerData, 
    onAnswerSubmit 
}) => {
    
    // Placeholder rendering logic - to be replaced with actual components
    const renderQuestionType = () => {
        switch (question.question_type) {
            case 'learn':
                return <LearnQuestionComponent question={question} onAnswerSubmit={onAnswerSubmit} />;
            case 'choice_to_char':
            case 'choice_to_image':
                return <ChoiceQuestionComponent question={question} onAnswerSubmit={onAnswerSubmit} currentAnswerData={currentAnswerData} />;
            case 'detect':
                return <DetectQuestionComponent question={question} onAnswerSubmit={onAnswerSubmit} />;
            default:
                return <p>Unsupported question type: {question.question_type}</p>;
        }
    };

    return (
        <div className="question-display-container p-4 border rounded-md bg-gray-50">
            <h3 className="text-xl font-semibold mb-3">Question Type: {question.question_type.toUpperCase()}</h3>
            {renderQuestionType()}
            {currentAnswerData && (
                <div className={`mt-4 p-2 rounded ${currentAnswerData.is_correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {`Your last answer: "${currentAnswerData.user_choice}" was ${currentAnswerData.is_correct ? 'Correct' : 'Incorrect'}.`}
                </div>
            )}
        </div>
    );
};

export default QuestionDisplay; 