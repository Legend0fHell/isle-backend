'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { loadHandsModule } from '@/components/useHands';
import Image from "next/image";
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import type { Hands, Results } from "@mediapipe/hands";
import type { Camera } from "@mediapipe/camera_utils";
import { X } from "lucide-react";
import { socket, getConnectionState, closeConnectionError, reconnect, ensureSocketConnected } from "models/wsEventListener";
import { HandSignResponse, formatLandmarksForWebSocket } from "models/resultDetection";

const DetectingModePage = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const handsRef = useRef<Hands | null>(null);
    const [showPopup, setShowPopup] = useState(true);
    const [currentUserText, setCurrentUserText] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [suggestionResult, setSuggestionResult] = useState<string>("Example...");
    
    // WebSocket state managed in the component for reactivity
    const [isConnected, setIsConnected] = useState(getConnectionState().isConnected);
    const [showConnectionError, setShowConnectionError] = useState(getConnectionState().showConnectionError);
    const [detectionResult, setDetectionResult] = useState<string>("Example...");

    const closePopup = () => {
        setShowPopup(false);
    }

    // Handle closing connection error popup
    const handleCloseConnectionError = useCallback(() => {
        closeConnectionError();
        setShowConnectionError(false);
    }, []);

    // Handle reconnection
    const handleReconnect = useCallback(() => {
        reconnect();
        setShowConnectionError(false);
    }, []);

    useEffect(() => {
        const iframe = document.querySelector("iframe")
        if (!showPopup && iframe) {
            const iframeSrc = iframe.src
            iframe.src = iframeSrc
        }
    }, [showPopup]);

    // Setup WebSocket connection and event listeners
    useEffect(() => {
        // Make sure socket is connected (this is handled by wsEventListener, but we check here too)
        ensureSocketConnected();

        // Update local state when connection state changes
        const updateConnectionState = () => {
            const state = getConnectionState();
            setIsConnected(state.isConnected);
            setShowConnectionError(state.showConnectionError);
        };

        // Local event handlers
        const handleConnect = () => {
            updateConnectionState();
        };

        const handleDisconnect = () => {
            updateConnectionState();
        };

        const handleHandsignResponse = (data: HandSignResponse) => {
            console.log('Hand sign detected:', data);
            if (data && data.pred) {
                setDetectionResult(data.pred);
            }
        };

        // Add local event listeners
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('res_handsign', handleHandsignResponse);

        // Initial check
        updateConnectionState();

        // Cleanup local listeners on unmount
        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('res_handsign', handleHandsignResponse);
        };
    }, []);

    // When a detection result is received, update the user's text
    useEffect(() => {
        if (detectionResult && detectionResult !== "Example...") {
            setCurrentUserText(prev => prev + detectionResult);
        }
    }, [detectionResult]);

    // Handler for sending hand landmarks
    const sendHandLandmarks = useCallback((landmarks: any[]) => {
        if (!isConnected) return;

        const formattedData = formatLandmarksForWebSocket(landmarks);
        if (formattedData) {
            socket.emit('req_handsign', formattedData);
        }
    }, [isConnected]);

    const processDetection = async (landmarks: any) => {
        if (isProcessing || !landmarks || !isConnected) return;

        setIsProcessing(true);

        try {
            // Send landmarks via WebSocket
            console.log("Sending landmarks to WebSocket");
            sendHandLandmarks(landmarks);
            
            // For demonstration - simple auto-suggestion based on current text
            setSuggestionResult(currentUserText + "...");
        } catch (error) {
            console.error("Error processing detection:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        let handsInstance: Hands | null = null;
        let cameraInstance: Camera | null = null;
        let lastProcessTime = 0;
        const PROCESS_INTERVAL = parseInt(process.env.MEDIAPIPE_PROCESS_INTERVAL || '250'); // Process interval in ms

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

                    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                        for (const landmarks of results.multiHandLandmarks) {
                            Draw.drawConnectors(ctx, landmarks, HAND_CONNECTIONS,
                                { color: '#00FF00', lineWidth: 2 });
                            Draw.drawLandmarks(ctx, landmarks,
                                { color: '#FF0000', lineWidth: 1, radius: 2 });
                        }

                        // Process detection at intervals
                        const now = Date.now();
                        if (now - lastProcessTime > PROCESS_INTERVAL) {
                            lastProcessTime = now;
                            processDetection(results.multiHandLandmarks);
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
                setCameraError('Cannot access webcam. Please allow camera permissions!');
                console.error('Camera error:', err);
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

            {showConnectionError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="relative w-full max-w-md rounded-xl bg-red-50 p-6 shadow-2xl animate-in fade-in duration-300">
                        <button
                            onClick={handleCloseConnectionError}
                            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-red-100"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </button>

                        <h3 className="mb-4 text-xl font-semibold text-red-700">Connection Lost</h3>
                        <p className="mb-4 text-red-600">
                            The connection to the hand sign recognition service has been lost. Please check your internet connection.
                        </p>
                        <div className="flex justify-center">
                            <button 
                                onClick={handleReconnect} 
                                className="px-4 py-2 text-white bg-red-700 rounded-lg shadow-md hover:bg-red-800"
                            >
                                Reconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Navbar />
            <section className="relative top-[80px] left-[90px] w-[874px] h-[289px] gap-[40px] horizontal-layout align-top align-left">
                <div className="absolute top-[0px] left-[0px] w-[874px] h-[173px] vertical-layout align-top-left gap-[24px]">
                    <span className="absolute top-[0px] left-[0px] w-[874px] h-[77px] text-[64px] text-black align-left align-top font-bold"
                        style={{ fontWeight: 800, letterSpacing: '-2%' }}>
                        Detecting Mode
                    </span>
                    <span className="absolute top-[110px] left-[0px] w-[874px] h-[72px] text-[24px] text-black align-left align-middle opacity-50">
                        ISLE features hand sign detection for accurate and seamless recognition. Let's turn on your webcam and try it out now !
                    </span>
                </div>
            </section>

            <section className="absolute top-[480px] left-[90px] w-[1280px] h-[604px]">
                <div className="absolute top-[0px] left-[913px] w-[367px] h-[290px]">
                    <span className="absolute top-[0px] left-[0.5px] w-[367px] h-[52.09px]"
                        style={{ fontSize: '44px', fontWeight: 600 }}>
                        RESULTS
                    </span>

                    <div className="absolute top-[65.32px] left-[0px] w-[367px] h-[224.68px] bg-[#E6E6E6] rounded-lg">
                        <span className="absolute top-[12px] left-[24px] w-[319px] h-[201px] text-[24px] text-black align-left align-top">
                            {detectionResult}
                        </span>
                    </div>
                </div>
            </section>

            <section className="absolute top-[811px] left-[90px] w-[1280px] h-[604px]">
                <div className="absolute top-[0px] left-[913px] w-[367px] h-[290px]">
                    <span className="absolute top-[0px] left-[0.5px] w-[367px] h-[52.09px]"
                        style={{ fontSize: '44px', fontWeight: 600 }}>
                        SUGGESTED
                    </span>

                    <div className="absolute top-[65.32px] left-[0px] w-[367px] h-[224.68px] bg-[#E6E6E6] rounded-lg">
                        <span className="absolute top-[12px] left-[24px] w-[319px] h-[201px] text-[24px] text-black align-left align-top">
                            {suggestionResult}
                        </span>
                    </div>
                </div>
            </section>

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

            <span className="absolute top-[1284px] left-[90px] w-[625px] h-[44px] text-[40px] text-black"
                style={{ fontWeight: 600 }}>
                Other Function
            </span>

            <section className="absolute top-[1376px] left-[90px] w-[1280px] h-[434px] gap-x-[32px]">
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

            <div className="absolute top-[1916px] left-[90px]">
                <Footer />
            </div>
        </div>
    );
}

export default DetectingModePage;