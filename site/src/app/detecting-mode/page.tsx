'use client';
import { useState, useCallback, useEffect } from 'react';
import React from "react";
import { X, ArrowRight, Trash2, Check } from "lucide-react";
import Navbar from "../../components/navbar";
import HandDetectionCamera from "@/components/HandDetectionCamera";
import { socket } from "models/wsEventListener";

const CONSECUTIVE_THRESHOLD = 6;

const DetectingModePage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [currentUserText, setCurrentUserText] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [inlineSuggestion, setInlineSuggestion] = useState<string>("");
    
    // State for consecutive detection
    const [lastDetectedChar, setLastDetectedChar] = useState<string | null>(null);
    const [consecutiveCount, setConsecutiveCount] = useState<number>(0);

    // Request autocomplete suggestions whenever text changes
    useEffect(() => {
        if (currentUserText.trim()) {
            setIsLoadingSuggestions(true);
            socket.emit('req_autocomp', { text: currentUserText.toLowerCase() });
            setInlineSuggestion("");
        } else {
            setSuggestions([]);
            setInlineSuggestion("");
        }
    }, [currentUserText]);

    // Listen for autocomplete suggestions from the server
    useEffect(() => {
        const handleAutocompResponse = (data: { suggestions: string[] }) => {
            setIsLoadingSuggestions(false);
            if (data && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
                setSuggestions(data.suggestions);
                // Set the first suggestion as the inline suggestion
                if (data.suggestions[0]) {
                    setInlineSuggestion(data.suggestions[0]);
                }
            } else {
                setSuggestions([]);
                setInlineSuggestion("");
            }
        };
        
        socket.on('res_autocomp', handleAutocompResponse);
        return () => {
            socket.off('res_autocomp', handleAutocompResponse);
        };
    }, []);

    // Handle suggestion selection
    const selectSuggestion = useCallback((suggestion: string) => {
        setCurrentUserText(currentText => currentText.toLowerCase() + suggestion + " ");
        setSuggestions([]);
        setInlineSuggestion("");
        setSelectedSuggestionIndex(-1);
    }, []);

    const clearText = useCallback(() => {
        setCurrentUserText("");
        setSuggestions([]);
        setInlineSuggestion("");
        setSelectedSuggestionIndex(-1);
    }, []);

    const acceptText = useCallback(() => {
        // Here you would handle saving or processing the final text
        console.log("Text accepted:", currentUserText.toLowerCase());
        // Could add animation or feedback here
    }, [currentUserText]);

    const acceptInlineSuggestion = useCallback(() => {
        if (inlineSuggestion) {
            selectSuggestion(inlineSuggestion);
        }
    }, [inlineSuggestion, selectSuggestion]);

    const handleDetectionResult = useCallback((prediction: string) => {
        if (prediction) {
            // Convert prediction to lowercase
            const lowercasePrediction = prediction.toLowerCase();
            
            if (lowercasePrediction === lastDetectedChar) {
                const newCount = consecutiveCount + 1;
                setConsecutiveCount(newCount);
                if (newCount >= CONSECUTIVE_THRESHOLD) {
                    // Special character handling
                    if (lowercasePrediction === "delete") {
                        setCurrentUserText(prev => prev.slice(0, -1));
                    } else if (lowercasePrediction === "space") {
                        setCurrentUserText(prev => prev + " ");
                    } else if (lowercasePrediction === "autocmp") {
                        if (inlineSuggestion) {
                            acceptInlineSuggestion();
                        } else if (suggestions.length > 0) {
                            // Use the first suggestion or the selected one
                            const suggestionIndex = selectedSuggestionIndex >= 0 ? 
                                selectedSuggestionIndex : 0;
                            selectSuggestion(suggestions[suggestionIndex]);
                        }
                    } else {
                        setCurrentUserText(prev => prev + lowercasePrediction);
                    }
                    
                    // Reset for next sequence
                    setConsecutiveCount(0);
                    setLastDetectedChar(null);
                }
            } else {
                setLastDetectedChar(lowercasePrediction);
                setConsecutiveCount(1); // Start counting for the new character
            }
        }
    }, [lastDetectedChar, consecutiveCount, suggestions, selectedSuggestionIndex, selectSuggestion, inlineSuggestion, acceptInlineSuggestion]);

    const closePopup = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        const iframe = document.querySelector("iframe");
        if (!showPopup && iframe) {
            const iframeSrc = iframe.src;
            iframe.src = iframeSrc;
        }
    }, [showPopup]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
            <Navbar />

            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
                    <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900 animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={closePopup}
                            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button>

                        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Hướng dẫn cách chơi</h3>

                        <div className="relative mb-6 overflow-hidden rounded-lg pt-[56.25%]">
                            <iframe
                                className="absolute inset-0 h-full w-full border-0"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder video
                                title="Hướng dẫn cách chơi"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="flex justify-center">
                            <button onClick={closePopup} className="px-4 py-2 text-white bg-black rounded-lg shadow-md hover:bg-white hover:text-black hover:shadow-lg dark:bg-gray-800 dark:hover:bg-gray-700">
                                SKIP & START
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!showPopup && (
                <main className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 gap-4 md:gap-6 gap-8 mt-16">
                    {/* Title section */}
                    <section className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Detecting Mode
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
                            ISLE features hand sign detection for accurate and seamless recognition. Let&apos;s turn on your webcam and try it out now!
                        </p>
                    </section>
                    
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
                        {/* Left column: Camera */}
                        <div className="lg:w-3/5">
                            {/* Hand Detection Camera */}
                            <HandDetectionCamera
                                onDetectionResult={handleDetectionResult}
                                consecutiveCount={consecutiveCount}
                                consecutiveThreshold={CONSECUTIVE_THRESHOLD}
                                className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
                            />
                        </div>
                        
                        {/* Right column: Text input with suggestions */}
                        <div className="lg:w-2/5 flex flex-col">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex-grow flex flex-col">
                                {/* Text input area with browser-like suggestions */}
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center mb-4 justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Text Input
                                        </h2>
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={clearText}
                                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                title="Clear text"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={acceptText}
                                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                title="Accept text"
                                            >
                                                <Check className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Browser-like input field with inline suggestions */}
                                    <div className="relative flex-grow">
                                        <div className="w-full p-3 rounded-t-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 min-h-[100px] max-h-[200px] overflow-y-auto whitespace-pre-wrap break-words text-lg">
                                            {currentUserText ? (
                                                <div>
                                                    <span className="text-gray-900 dark:text-gray-100">{currentUserText.toLowerCase()}</span>
                                                    {inlineSuggestion && (
                                                        <span className="text-gray-400 dark:text-gray-500">{inlineSuggestion}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">start signing to input text...</span>
                                            )}
                                        </div>
                                        
                                        {/* Suggestions dropdown */}
                                        {suggestions.length > 0 && (
                                            <div className="absolute w-full bg-white dark:bg-gray-900 border border-t-0 border-gray-300 dark:border-gray-700 rounded-b-lg shadow-lg z-10">
                                                <ul>
                                                    {suggestions.map((suggestion, index) => (
                                                        <li
                                                            key={`${suggestion}-${index}`}
                                                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between ${selectedSuggestionIndex === index ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                                                            onClick={() => selectSuggestion(suggestion)}
                                                            onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                                        >
                                                            <div>
                                                                <span>{currentUserText.toLowerCase()}</span>
                                                                <span className="font-bold">{suggestion}</span>
                                                            </div>
                                                            {selectedSuggestionIndex === index && (
                                                                <ArrowRight className="h-4 w-4 text-blue-500" />
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {isLoadingSuggestions && (
                                            <div className="absolute w-full flex justify-center p-2 bg-white dark:bg-gray-900 border border-t-0 border-gray-300 dark:border-gray-700 rounded-b-lg">
                                                <div className="animate-pulse flex space-x-2">
                                                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Gesture hint */}
                                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <h3 className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-2">Gesture Hints:</h3>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div className="flex items-center space-x-1">
                                                <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded text-xs">Space</span>
                                                <span>Add space</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-1.5 py-0.5 rounded text-xs">Delete</span>
                                                <span>Delete char</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded text-xs">Autocmp</span>
                                                <span>Use suggestion</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
}

export default DetectingModePage;