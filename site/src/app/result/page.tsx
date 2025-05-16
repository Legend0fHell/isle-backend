"use client";
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';

const ResultPage = () => {
    return (
        <div>
            <Navbar />

            {/* Learning Mode Section */}
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

            {/* Score Section */}
            <section className="text-center mb-16 py-10">
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4"
                    style={{ fontWeight: 800, fontFamily: 'Inter' }}>
                    YOUR SCORE:</h2>
                <p className="text-5xl font-bold text-purple-400 py-2 font-jersey10">
                    88/100
                </p>

                <div className="mt-8 py-6">
                    <Link
                        href="/learning-mode"
                        className="inline-block bg-black text-white px-12 py-3 rounded-md hover:bg-black/90 font-semibold text-lg hover:shadow-[0px_10px_20px_rgba(0,0,0,0.5)] hover:text-black hover:bg-white"
                    >
                        RE:Play
                    </Link>
                </div>
            </section>

            <span className="absolute top-[900px] left-[90px] w-[625px] h-[44px] text-[40px] text-black"
                style={{ fontWeight: 600 }}>
                Other Function
            </span>

            <section className="absolute top-[992px] left-[90px] w-[1280px] h-[434px] gap-x-[32px]">
                <div className="absolute top-[0px] left-[0px] w-[622px] h-[434px]">
                    <button className='absolute top-[0px] left-[0px] w-[622px] h-[311px] hover:shadow-[0px_10px_20px_rgba(0,0,0,0.5)]'>
                        <Link href="/learning-mode">
                            <Image className="rounded-lg"
                                src='/Learning Mode.png'
                                alt='Learning Mode'
                                width={622}
                                height={311}
                            />
                        </Link>
                    </button>

                    <div className="absolute top-[335px] left-[0px] w-[622px] h-[64px]">
                        <span className="absolute top-[0px] left-[0px] w-[622px] h-[30px] text-[20px] text-black"
                            style={{ fontWeight: 600 }}>
                            Learning Mode
                        </span>

                        <span className="absolute top-[34px] left-[0px] w-[622px] h-[30px] text-[20px] text-black opacity-50"
                            style={{ fontWeight: 400 }}>
                            TO LEARNING MODE
                        </span>
                    </div>
                </div>

                <div className="absolute top-[0px] left-[654px] w-[622px] h-[434px]">
                    <button className='absolute top-[0px] left-[0px] w-[622px] h-[311px] hover:shadow-[0px_10px_20px_rgba(0,0,0,0.5)]'>
                        <Link href="/dashboard">
                            <Image className="rounded-lg"
                                src='/Back to Homepage.png'
                                alt='Back to Dashboard'
                                width={622}
                                height={311}
                            />
                        </Link>
                    </button>

                    <div className="absolute top-[335px] left-[0px] w-[622px] h-[64px]">
                        <span className="absolute top-[0px] left-[0px] w-[622px] h-[30px] text-[20px] text-black"
                            style={{ fontWeight: 600 }}>
                            Home
                        </span>

                        <span className="absolute top-[34px] left-[0px] w-[622px] h-[30px] text-[20px] text-black opacity-50"
                            style={{ fontWeight: 400 }}>
                            BACK TO DASHBOARD
                        </span>
                    </div>
                </div>
            </section>

            <div className="absolute top-[1550px] left-[0px]">
                <Footer />
            </div>

        </div>
    );
}

export default function Page() {
    return (
        <div>
            <ResultPage />
        </div>
    );
}