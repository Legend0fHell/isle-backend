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
    lessonType?: string; // Lesson type for conditional rendering
    isTestSubmitted?: boolean; // Whether a test has been submitted
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
    question, 
    currentAnswerData, 
    onAnswerSubmit,
    lessonType = 'practice', // Default to practice if not specified
    isTestSubmitted = false // Default to false
}) => {
    
    // Placeholder rendering logic - to be replaced with actual components
    const renderQuestionType = () => {
        switch (question.question_type) {
            case 'learn':
                return <LearnQuestionComponent 
                    question={question} 
                    onAnswerSubmit={onAnswerSubmit} 
                    currentAnswerData={currentAnswerData}
                />;
            case 'choice_to_char':
            case 'choice_to_image':
                return <ChoiceQuestionComponent 
                    question={question} 
                    onAnswerSubmit={onAnswerSubmit} 
                    currentAnswerData={currentAnswerData} 
                    lessonType={lessonType}
                    isTestSubmitted={isTestSubmitted}
                />;
            case 'detect':
                return <DetectQuestionComponent 
                    question={question} 
                    onAnswerSubmit={onAnswerSubmit} 
                    currentAnswerData={currentAnswerData}
                />;
            default:
                return <p>Unsupported question type: {question.question_type}</p>;
        }
    };

    return (
        <div className="question-display-container h-full overflow-y-auto p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            {renderQuestionType()}
        </div>
    );
};

export default QuestionDisplay; 