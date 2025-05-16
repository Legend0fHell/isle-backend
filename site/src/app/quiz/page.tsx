"use client";
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const QuizPage = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

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
                            <button className="bg-[#d4d4d4] p-4 rounded text-left w-full">Your answer is correct!</button>
                        </div>
                    )}
                </div>

                {/* Next Quiz Button */}
                <div className="flex justify-center">
                    <button
                        className="w-[222px] h-[68px] bg-[#000000] text-white shadow-[0px_10px_20px_rgba(0,0,0,0.3)] rounded-lg hover:bg-[#FFFFFF] hover:text-black hover:shadow-[0px_10px_20px_rgba(0,0,0,0.5)]"
                        style={{ fontSize: "24px", fontWeight: 400 }}
                        onClick={() => window.location.href = "/result"}
                    >
                        Next Quiz!
                    </button>
                </div>
                <br />
                <br />
                <br />

            </div>
        </main>
    );
}

export default function Page() {
    return (
        <div>
            <Navbar />
            <QuizPage />
            <Footer />
        </div>
    );
}