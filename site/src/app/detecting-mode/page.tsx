'use client';
import { useState, useCallback, useEffect } from 'react';
import React from "react";
import { X } from "lucide-react";
import { HandSignResponse } from "models/resultDetection";
import Navbar from "../../components/navbar";
import HandDetectionCamera from "@/components/HandDetectionCamera";

const CONSECUTIVE_THRESHOLD = 6;

const DetectingModePage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [currentUserText, setCurrentUserText] = useState<string>("");
    const [suggestionResult, setSuggestionResult] = useState<string>("Example...");
    
    // State for consecutive detection
    const [lastDetectedChar, setLastDetectedChar] = useState<string | null>(null);
    const [consecutiveCount, setConsecutiveCount] = useState<number>(0);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleDetectionResult = useCallback((prediction: string, _resultData?: HandSignResponse) => {
        if (prediction) {
            if (prediction === lastDetectedChar) {
                const newCount = consecutiveCount + 1;
                setConsecutiveCount(newCount);
                if (newCount >= CONSECUTIVE_THRESHOLD) {
                    setCurrentUserText(prev => prev + prediction);
                    // Reset for next sequence (of any char)
                    setConsecutiveCount(0); 
                    setLastDetectedChar(null); // Reset last char so the next detection starts fresh
                }
            } else {
                setLastDetectedChar(prediction);
                setConsecutiveCount(1); // Start counting for the new character
            }
            // Update suggestion based on the current text and prediction
            setSuggestionResult(currentUserText + prediction + "...");
        }
    }, [lastDetectedChar, consecutiveCount, currentUserText]);

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
            {/* Use the reusable Navbar component */}
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

            {/* Main content area - excluding popups */} 
            {!showPopup && (
                <main className="flex-grow flex flex-col lg:flex-row p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8 mt-16"> {/* Added mt-16 for potential fixed navbar space */} 
                    
                    {/* Left Column: Intro Text and Video Feed */}
                    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 lg:w-2/3">
                        <section className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                Detecting Mode
                            </h1>
                            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
                                ISLE features hand sign detection for accurate and seamless recognition. Let&apos;s turn on your webcam and try it out now!
                            </p>
                        </section>

                        {/* Hand Detection Camera with HUD */}
                        <HandDetectionCamera
                            onDetectionResult={handleDetectionResult}
                            consecutiveCount={consecutiveCount}
                            consecutiveThreshold={CONSECUTIVE_THRESHOLD}
                            className="flex-grow"
                        />
                    </div>

                    {/* Right Column: Results and Suggestions */}
                    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 lg:w-1/3">
                        <section className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-1/2 flex flex-col">
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                                RESULTS
                            </h2>
                            <div className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-lg p-3 overflow-y-auto">
                                <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                    {currentUserText || "..."}
                                </p>
                            </div>
                        </section>

                        <section className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-1/2 flex flex-col">
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                                SUGGESTED
                            </h2>
                            <div className="flex-grow bg-gray-100 dark:bg-gray-700 rounded-lg p-3 overflow-y-auto">
                                <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                    {suggestionResult}
                                </p>
                            </div>
                        </section>
                    </div>
                </main>
            )}
        </div>
    );
}

export default DetectingModePage;