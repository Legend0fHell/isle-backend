"use client";
import React, { useEffect, useRef, useState } from 'react';

// Utility function to get a random integer between min and max (inclusive)
function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const QuizPage = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [correctAnswer] = useState<number>(randomNumber(0, 3)); // set random thôi :)))

    return (
        <main>
            <section className="relative top-[80px] left-[90px] w-[874px] h-[289px] gap-[40px] horizontal-layout align-top align-left">
                <div className="absolute top-[0px] left-[0px] w-[874px] h-[173px] vertical-layout align-top-left gap-[24px]">
                    <span className="absolute top-[0px] left-[0px] w-[874px] h-[77px] text-[64px] text-black align-left align-top font-bold"
                        style={{ fontWeight: 800, letterSpacing: '-2%' }}>
                        Learning Mode
                    </span>
                    <span className="absolute top-[110px] left-[0px] w-[874px] h-[72px] text-[24px] text-black align-left align-middle opacity-50">
                        Wanna practice ? Okay, we got you. Here you are.
                    </span>
                </div>
            </section>

            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-medium text-center mb-6">Which is answer for this GIF ?</h2>

                {/* GIF Placeholder */}
                <div className="w-full h-[400px] bg-black mb-8 rounded-lg"></div>

                {/* Answer Options */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {selectedAnswer === null ? (
                        <>
                            <button
                                onClick={() => setSelectedAnswer(0)}
                                className="bg-[#d4d4d4] p-4 rounded text-left hover:bg-[#e6e6e6]"
                            >
                                Example ...
                            </button>
                            <button
                                onClick={() => setSelectedAnswer(1)}
                                className="bg-[#d4d4d4] p-4 rounded text-left hover:bg-[#e6e6e6]"
                            >
                                Example ...
                            </button>
                            <button
                                onClick={() => setSelectedAnswer(2)}
                                className="bg-[#d4d4d4] p-4 rounded text-left hover:bg-[#e6e6e6]"
                            >
                                Example ...
                            </button>
                            <button
                                onClick={() => setSelectedAnswer(3)}
                                className="bg-[#d4d4d4] p-4 rounded text-left hover:bg-[#e6e6e6]"
                            >
                                Example ...
                            </button>
                        </>
                    ) : (
                        <div className="col-span-2">
                            {selectedAnswer === correctAnswer ? (
                                <p className="text-green-500 text-center mb-4">Correct!</p>
                            ) : (
                                <p className="text-red-500 text-center mb-4">Wrong! The correct answer is option {correctAnswer + 1}.</p>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}

export default QuizPage;