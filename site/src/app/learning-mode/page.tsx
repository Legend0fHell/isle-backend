"use client";

import { useState, useEffect } from "react"
import DetectingModePage from "./detecting-mode/page"
import QuizPage from "./quiz/page"
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const LearningModePage = () => {
    // Ham logic viet not sau, sau khi co questions.ts i guess
    const [showPopup, setShowPopup] = useState(false);
    const [isDetectingMode, setIsDetectingMode] = useState(true);
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);

    // can 1 function get so QUEST, 1 function get loai cau hoi, 1 function tra cau hoi user, 1 function check tien do user ( co the nhet sang ben quizpage nho )

    const closePopup = () => {
        setShowPopup(false);
    }

    // const handleNextQuizClick = () => {
    //     // setNumberOfQuestions(prev => prev + 1);
    //     setIsMovementCheck(true);
    //     console.log("Number of Questions: ", numberOfQuestions);
    // }

    // useEffect(() => {
    //     if (numberOfQuestions < 10) {
    //         setIsMovementCheck(true);
    //     } else {
    //         setIsMovementCheck(false);
    //     }
    // }, [numberOfQuestions]);

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
            {isDetectingMode ? <DetectingModePage /> : <QuizPage />}

            <button
                className="absolute top-[1181px] left-[609px] w-[222px] h-[68px] bg-[#000000] text-white shadow-[0px_10px_20px_rgba(0,0,0,0.3)] rounded-lg hover:bg-[#FFFFFF] hover:text-black hover:shadow-[0px_10px_20px_rgba(0,0,0,0.5)]"
                style={{ fontSize: "24px", fontWeight: 400 }}
                onClick={() => {
                    window.location.href = "/learning-mode";
                }}
            >
                Next Quiz!
            </button>

        </main>
    )
};


export default function Page() {
    return (
        <div>
            <div className="relative w-full">
                <Navbar />
            </div>
            <LearningModePage />
            <div className="absolute top-[1450px] left-[90px]">
                <Footer />
            </div>
        </div>
    )
}