import React from 'react';
import Image from 'next/image';
import { useASLCharacters } from '../contexts/ASLCharacterContext';

interface HintPopupProps {
    characterName: string; // This will be the question_target
    onClose: () => void;
    isOpen: boolean;
}

const HintPopup: React.FC<HintPopupProps> = ({ characterName, onClose, isOpen }) => {
    const { getCharacter, isLoading, error } = useASLCharacters();
    const characterData = getCharacter(characterName);

    if (!isOpen) {
        return null;
    }

    // Helper to extract YouTube video ID from URL (same as in LearnQuestionComponent)
    const getYouTubeVideoId = (url: string | undefined): string | null => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = characterData ? getYouTubeVideoId(characterData.char_tutorial_url) : null;
    const localImagePath = characterName ? `/asl_example/${characterName}.jpg` : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full space-y-4 relative max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                    aria-label="Close hint"
                >
                    &times;
                </button>

                <h3 className="text-2xl font-bold text-center mb-4">Hint for: <span className="text-blue-600">{characterName}</span></h3>

                {isLoading && <div className="text-center">Loading hint...</div>}
                {error && <div className="text-center text-red-500">Error loading character data: {error}</div>}
                
                {characterData ? (
                    <div className="space-y-4">
                        {videoId && (
                            <div className="video-container aspect-video bg-gray-200 rounded-lg shadow-md overflow-hidden">
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
                            <div className="p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm">
                                <p>Video link provided, but it may not be a YouTube video or the URL is invalid: <a href={characterData.char_tutorial_url} target="_blank" rel="noopener noreferrer" className="underline">{characterData.char_tutorial_url}</a></p>
                            </div>
                        )}

                        {/* Display local image using characterName */}
                        {localImagePath && (
                            <div className="image-container bg-gray-100 p-3 rounded-lg shadow-md flex justify-center items-center relative w-full max-w-sm h-56 mx-auto">
                                <Image 
                                    src={localImagePath} 
                                    alt={`Sign for ${characterName}`}
                                    layout="intrinsic"
                                    width={200} 
                                    height={200} 
                                    className="object-contain rounded"
                                />
                            </div>
                        )}
                        
                        {characterData.char_tutorial_text && (
                            <div className="text-guide bg-gray-100 p-3 rounded-lg shadow-md">
                                <h4 className="text-md font-semibold mb-1">How to make the sign:</h4>
                                <p className="text-gray-700 whitespace-pre-line text-sm">{characterData.char_tutorial_text}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    !isLoading && <div className="text-center text-red-500">Detailed hint data not found for: {characterName}</div>
                )}

                <div className="mt-6 text-center">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-150"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HintPopup; 