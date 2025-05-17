"use client";
"use client"

import { useState, useEffect } from "react"
import MovementCheckingModePage from "../movement-check/page"
import QuizPage from "../quiz/page"
import { X } from "lucide-react"

const LearningModePage = () => {
    const [showPopup, setShowPopup] = useState(true)
    const [isMovementCheck] = useState(true); // hiểu đơn giản là nếu là true thì sẽ vào movement check, false thì vào quiz

    // Function to close the popup
    const closePopup = () => {
        setShowPopup(false)
    }

    // Stop YouTube video when popup is closed
    useEffect(() => {
        const iframe = document.querySelector("iframe")
        if (!showPopup && iframe) {
            const iframeSrc = iframe.src
            iframe.src = iframeSrc
        }
    }, [showPopup])

    return (
        <main className="relative min-h-screen">
            {/* Modern Popup with YouTube Video */}
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
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="Hướng dẫn cách chơi"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="flex justify-center">
                            <button onClick={closePopup} className="px-4 py-2 text-white bg-black rounded-lg shadow-md hover:bg-white hover:text-black hover:shadow-lg">
                                SKIP
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            {isMovementCheck ? <MovementCheckingModePage /> : <QuizPage />}
        </main>
    )
};

export default LearningModePage;


