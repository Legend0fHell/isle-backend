'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { loadHandsModule } from '@/components/useHands';
import type { Hands, Results } from "@mediapipe/hands";
import type { Camera } from "@mediapipe/camera_utils";
import {
    socket,
    getConnectionState as getWebSocketConnectionState, // Renamed to avoid conflict
    closeConnectionError as closeWebSocketConnectionError, // Renamed
    reconnect as reconnectWebSocket, // Renamed
    ensureSocketConnected,
    subscribeToConnectionState
} from "models/wsEventListener";
import {
    HandSignResponse,
    formatLandmarksForWebSocket,
    MediaPipeLandmarks
} from "models/resultDetection";

interface UseHandDetectionProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    onDetectionResult: (prediction: string, resultData?: HandSignResponse) => void; // Updated to include full result data
    processInterval?: number; // Optional processing interval in ms
    enableDrawing?: boolean; // Optional: whether to draw landmarks on canvas
}

export const useHandDetection = ({
    videoRef,
    canvasRef,
    onDetectionResult,
    processInterval = 250, // Default interval
    enableDrawing = true, // Default to true
}: UseHandDetectionProps) => {
    const handsRef = useRef<Hands | null>(null);
    const cameraInstanceRef = useRef<Camera | null>(null);
    const [isCameraStarting, setIsCameraStarting] = useState<boolean>(false);
    const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isDetecting, setIsDetecting] = useState<boolean>(false); // Tracks if detection loop is active

    // WebSocket state from wsEventListener, managed locally for the hook consumer
    const [isConnectedToWebSocket, setIsConnectedToWebSocket] = useState(getWebSocketConnectionState().isConnected);
    const [showWebSocketError, setShowWebSocketError] = useState(getWebSocketConnectionState().showConnectionError);

    // Latest detection result data
    const [detectionData, setDetectionData] = useState<HandSignResponse | null>(null);

    // Processing state
    const [isProcessingLandmarks, setIsProcessingLandmarks] = useState(false);
    const lastProcessTimeRef = useRef(0);

    // Subscribe to WebSocket connection state changes
    useEffect(() => {
        const unsubscribe = subscribeToConnectionState((state) => {
            setIsConnectedToWebSocket(state.isConnected);
            setShowWebSocketError(state.showConnectionError);
        });
        ensureSocketConnected(); // Ensure connection attempt on hook mount
        return () => unsubscribe();
    }, []);

    // Handle WebSocket responses
    useEffect(() => {
        const handleHandsignResponse = (data: HandSignResponse) => {
            if (data && data.pred) {
                setDetectionData(data);
                onDetectionResult(data.pred, data);
            }
        };
        socket.on('res_handsign', handleHandsignResponse);
        return () => {
            socket.off('res_handsign', handleHandsignResponse);
        };
    }, [onDetectionResult]);

    const sendHandLandmarks = useCallback((landmarks: MediaPipeLandmarks) => {
        if (!isConnectedToWebSocket) {
            console.log("Not connected to WebSocket. Cannot send landmarks.");
            return;
        }
        const formattedData = formatLandmarksForWebSocket(landmarks);
        if (formattedData) {
            socket.emit('req_handsign', formattedData);
        } else {
            console.log("Failed to format landmarks for WebSocket.");
        }
    }, [isConnectedToWebSocket]);

    const processLandmarks = useCallback(async (landmarks: MediaPipeLandmarks) => {
        if (isProcessingLandmarks || !landmarks || !isConnectedToWebSocket) {
            return;
        }
        setIsProcessingLandmarks(true);
        try {
            sendHandLandmarks(landmarks);
        } catch (error) {
            console.error("Error processing landmarks:", error);
        } finally {
            setIsProcessingLandmarks(false);
        }
    }, [isConnectedToWebSocket, sendHandLandmarks, isProcessingLandmarks]);
    

    const startDetection = useCallback(async () => {
        if (!videoRef.current) {
            setCameraError("Video element is not available.");
            return;
        }
        if (isDetecting || isCameraStarting) return;

        setIsCameraStarting(true);
        setCameraError(null);
        setIsCameraReady(false);

        try {
            const modules = await loadHandsModule();
            if (!modules) {
                setCameraError("Failed to load MediaPipe Hands module.");
                setIsCameraStarting(false);
                return;
            }
            const { Hands, Camera, HAND_CONNECTIONS } = modules;

            const hands = new Hands({
                locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });
            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            hands.onResults((results: Results) => {
                if (enableDrawing && canvasRef.current && videoRef.current) {
                    const canvas = canvasRef.current;
                    const video = videoRef.current;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    // Set canvas size to match the displayed video element size
                    const displayWidth = video.clientWidth;
                    const displayHeight = video.clientHeight;
                    canvas.width = displayWidth;
                    canvas.height = displayHeight;
                    
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                        // Calculate the visible video area within the display element (for object-contain)
                        const videoRatio = video.videoWidth / video.videoHeight;
                        const displayRatio = displayWidth / displayHeight;
                        
                        let visibleWidth, visibleHeight, offsetX = 0, offsetY = 0;
                        if (displayRatio > videoRatio) {
                            // Video is letterboxed on sides
                            visibleHeight = displayHeight;
                            visibleWidth = visibleHeight * videoRatio;
                            offsetX = (displayWidth - visibleWidth) / 2;
                        } else {
                            // Video is letterboxed on top/bottom
                            visibleWidth = displayWidth;
                            visibleHeight = visibleWidth / videoRatio;
                            offsetY = (displayHeight - visibleHeight) / 2;
                        }
                        
                        // Draw the hand landmarks
                        for (const landmarks of results.multiHandLandmarks) {
                            // For each landmark, convert from normalized [0,1] to display coordinates
                            const scaledLandmarks = landmarks.map(landmark => ({
                                x: landmark.x * visibleWidth + offsetX,
                                y: landmark.y * visibleHeight + offsetY,
                                z: landmark.z,
                            }));
                            
                            // Draw.drawConnectors and Draw.drawLandmarks work with normalized coords
                            // So we need to use the raw landmarks with a manually configured matrix
                            ctx.save();
                            
                            // Draw connections
                            for (const connection of HAND_CONNECTIONS) {
                                const [i, j] = connection;
                                if (i >= 0 && i < scaledLandmarks.length && 
                                    j >= 0 && j < scaledLandmarks.length) {
                                    ctx.beginPath();
                                    ctx.moveTo(scaledLandmarks[i].x, scaledLandmarks[i].y);
                                    ctx.lineTo(scaledLandmarks[j].x, scaledLandmarks[j].y);
                                    ctx.strokeStyle = '#00FF00';
                                    ctx.lineWidth = 2;
                                    ctx.stroke();
                                }
                            }
                            
                            // Draw landmarks
                            for (const point of scaledLandmarks) {
                                ctx.beginPath();
                                ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                                ctx.fillStyle = '#FF0000';
                                ctx.fill();
                            }
                            
                            ctx.restore();
                        }
                    }
                }

                if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                    const now = Date.now();
                    if (now - lastProcessTimeRef.current > processInterval) {
                        lastProcessTimeRef.current = now;
                        processLandmarks(results.multiHandLandmarks as unknown as MediaPipeLandmarks);
                    }
                }
            });
            handsRef.current = hands;

            if (videoRef.current) {
                 const camera = new Camera(videoRef.current, {
                    onFrame: async () => {
                        if (videoRef.current && handsRef.current) {
                            await handsRef.current.send({ image: videoRef.current });
                        }
                    },
                    width: 640, // Standard width, can be overridden by component styles
                    height: 480 // Standard height
                });
                cameraInstanceRef.current = camera;
                await camera.start();
                setIsDetecting(true);
                setIsCameraReady(true);
            } else {
                 setCameraError("Video element became unavailable during setup.");
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                setCameraError(err.message);
            } else {
                setCameraError('Cannot access webcam or unknown error occurred. Please allow camera permissions!');
            }
            console.error('Camera setup error:', err);
        } finally {
            setIsCameraStarting(false);
        }
    }, [videoRef, canvasRef, processInterval, enableDrawing, processLandmarks, isDetecting, isCameraStarting]);

    const stopDetection = useCallback(() => {
        if (cameraInstanceRef.current) {
            cameraInstanceRef.current.stop();
            cameraInstanceRef.current = null;
        }
        if (handsRef.current) {
            handsRef.current.close().catch(console.error);
            handsRef.current = null;
        }
        setIsDetecting(false);
        setIsCameraReady(false);
        setIsCameraStarting(false);
         // Do not disconnect WebSocket here, as it's managed globally by wsEventListener
    }, []);

    // Cleanup on unmount or when dependencies change that require a restart
    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, [stopDetection]);

    return {
        startDetection,
        stopDetection,
        isCameraReady,
        isDetecting,
        cameraError,
        isConnectedToWebSocket,
        showWebSocketError,
        reconnectWebSocket, // Expose for UI control
        closeWebSocketConnectionError, // Expose for UI control
        detectionData // Expose the latest detection data
    };
}; 