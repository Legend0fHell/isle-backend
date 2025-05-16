'use client';
import { useEffect, useRef, useState } from 'react';
import { loadHandsModule } from '@/components/useHands';
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Hands, Results } from "@mediapipe/hands";
import type { Camera } from "@mediapipe/camera_utils";

const MovementCheckingModePage = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const handsRef = useRef<Hands | null>(null);

    useEffect(() => {
        let handsInstance: Hands | null = null;
        let cameraInstance: Camera | null = null;

        const setupHands = async () => {
            const modules = await loadHandsModule();
            if (!modules) return;

            const { Hands, Camera, Draw, HAND_CONNECTIONS } = modules;
            const hands = new Hands({
                locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });

            hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            hands.onResults((results: Results) => {
                const canvas = canvasRef.current;
                const video = videoRef.current;
                if (canvas && video) {
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    ctx.save();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

                    if (results.multiHandLandmarks) {
                        for (const landmarks of results.multiHandLandmarks) {
                            Draw.drawConnectors(ctx, landmarks, HAND_CONNECTIONS,
                                { color: '#00FF00', lineWidth: 2 });
                            Draw.drawLandmarks(ctx, landmarks,
                                { color: '#FF0000', lineWidth: 1, radius: 2 });
                        }
                    }

                    ctx.restore();
                }
            });

            handsRef.current = hands;
            handsInstance = hands;

            const camera = new Camera(videoRef.current as HTMLVideoElement, {
                onFrame: async () => {
                    if (videoRef.current) {
                        await hands.send({ image: videoRef.current });
                    }
                },
                width: 867,
                height: 604
            });

            cameraInstance = camera;
            camera.start().catch((err: unknown) => {
                setCameraError('Không thể truy cập webcam. Vui lòng cho phép quyền truy cập camera!');
                console.error('Lỗi camera:', err);
            });
        };

        setupHands();

        return () => {
            if (cameraInstance) cameraInstance.stop();
            if (handsInstance) handsInstance.close();
        };
    }, []);

    return (
        <div>
            <Navbar />
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

            <section className="absolute top-[480px] left-[90px] w-[367x] h-[290px]">
                <div className="absolute top-[0px] left-[913px] w-[367px] h-[290px]">
                    <span className="absolute top-[0px] left-[0.5px] w-[367px] h-[52.09px]"
                        style={{ fontSize: '44px', fontWeight: 600 }}>
                        HANDSIGN EXAMPLE
                    </span>

                    <div className="absolute top-[65.32px] left-[0px] w-[367px] h-[224.68px] bg-[#000000] rounded-lg">
                    </div>
                </div>
            </section>

            <section className="absolute top-[804px] left-[90px] w-[367px] h-[133px]">
                <div className="absolute top-[0px] left-[913px] w-[367px] h-[290px]">
                    <span className="absolute top-[0px] left-[0.5px] w-[367px] h-[52.09px]"
                        style={{ fontSize: '44px', fontWeight: 600 }}>
                        YOUR ANSWER
                    </span>

                    <div className="absolute top-[65.32px] left-[0px] w-[367px] h-[68px] bg-[#E6E6E6] rounded-lg">
                        <span className="absolute top-[12px] left-[24px] w-[319px] h-[36px] text-[24px] text-black align-left align-top">
                            Example...
                        </span>
                    </div>
                </div>
            </section>

            <section className="absolute top-[965px] left-[90px] w-[400px] h-[133px]">
                <div className="absolute top-[0px] left-[913px] w-[400px] h-[290px]">
                    <span className="absolute top-[0px] left-[0.5px] w-[400px] h-[52.09px]"
                        style={{ fontSize: '44px', fontWeight: 600 }}>
                        RIGHT ANSWER
                    </span>

                    <div className="absolute top-[65.32px] left-[0px] w-[367px] h-[68px] bg-[#E6E6E6] rounded-lg">
                        <span className="absolute top-[12px] left-[24px] w-[319px] h-[36px] text-[24px] text-black align-left align-top">
                            Example...
                        </span>
                    </div>
                </div>
            </section>

            <button
                className="absolute top-[1181px] left-[609px] w-[222px] h-[68px]  bg-[#000000] text-white shadow-[0px_10px_20px_rgba(0,0,0,0.3)] rounded-lg hover:bg-[#FFFFFF] hover:text-black hover:shadow-[0px_10px_20px_rgba(0,0,0,0.5)]"
                style={{ fontSize: "24px", fontWeight: 400 }}
                onClick={() => window.location.href = "/quiz"}
            >
                Next Quiz!
            </button>

            <div className="absolute top-[497px] left-[90px] w-[867px] h-[604px] rounded-lg shadow-lg">
                {cameraError ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                        {cameraError}
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            className="rounded-lg shadow-lg bg-black w-full h-full object-cover"
                            autoPlay
                            playsInline
                            muted
                        />
                        <canvas
                            ref={canvasRef}
                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        />
                    </>
                )}
            </div>
            <div className="absolute top-[1400px] left-[90px]">
                <Footer />
            </div>
        </div>
    );
}

export default MovementCheckingModePage;