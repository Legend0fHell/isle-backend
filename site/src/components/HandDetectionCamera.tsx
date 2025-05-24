'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHandDetection } from '@/hooks/useHandDetection';
import { HandSignResponse } from 'models/resultDetection';

interface HandDetectionCameraProps {
  onDetectionResult: (prediction: string, resultData?: HandSignResponse) => void;
  processInterval?: number;
  enableDrawing?: boolean;
  showHUD?: boolean;
  consecutiveCount?: number;
  consecutiveThreshold?: number;
  className?: string;
}

const HandDetectionCamera: React.FC<HandDetectionCameraProps> = ({
  onDetectionResult,
  processInterval = 250,
  enableDrawing = true,
  showHUD = true,
  consecutiveCount = 0,
  consecutiveThreshold = 0,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // State for pulse effect and tracking the last detection time
  const [showPulse, setShowPulse] = useState(false);
  const [lastDetectionTime, setLastDetectionTime] = useState<number>(0);
  const [currentDetection, setCurrentDetection] = useState<HandSignResponse | null>(null);
  
  const {
    startDetection,
    stopDetection,
    isCameraReady,
    isDetecting,
    cameraError,
    isConnectedToWebSocket,
    showWebSocketError,
    reconnectWebSocket,
    closeWebSocketConnectionError,
    detectionData
  } = useHandDetection({
    videoRef,
    canvasRef,
    onDetectionResult,
    processInterval,
    enableDrawing
  });
  
  // Start detection when the component mounts and WebSocket is connected
  useEffect(() => {
    let startTimeoutId: NodeJS.Timeout;
    if (isConnectedToWebSocket && !isDetecting && !cameraError) {
      startTimeoutId = setTimeout(() => {
        startDetection();
      }, 100);
    }
    return () => {
      if (startTimeoutId) clearTimeout(startTimeoutId);
    };
  }, [isConnectedToWebSocket, isDetecting, cameraError, startDetection]);
  
  // Update detection data and trigger pulse effect
  useEffect(() => {
    if (detectionData) {
      setCurrentDetection(detectionData);
      setLastDetectionTime(Date.now());
      
      // Add pulse effect
      setShowPulse(true);
      const timer = setTimeout(() => {
        setShowPulse(false);
      }, 300); // 300ms pulse effect
      
      return () => clearTimeout(timer);
    }
  }, [detectionData]);

  // Auto-reset prediction if no events in last 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastDetectionTime;
      
      // If it's been more than 5 seconds since the last detection and we have a detection
      if (timeElapsed > 5000 && currentDetection) {
        setCurrentDetection(null);
      }
    }, 1000); // Check every second
    
    return () => clearInterval(interval);
  }, [lastDetectionTime, currentDetection]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);
  
  return (
    <div className={`relative aspect-video bg-black rounded-lg shadow-lg overflow-hidden ${className}`}>
      {cameraError ? (
        <div className="w-full h-full flex items-center justify-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg">
          <div className="text-center">
            <p className="mb-2">{cameraError}</p>
            <button 
              onClick={startDetection} 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <video
            ref={videoRef}
            className="rounded-lg w-full h-full object-contain"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
          
          {/* HUD Overlay */}
          {showHUD && isDetecting && (
            <div className="absolute top-4 right-4 p-3 bg-black/80 backdrop-blur-sm rounded-lg text-white font-mono text-sm w-71 shadow-lg border border-gray-700">
              {/* Status row */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${isConnectedToWebSocket ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-xs">{isConnectedToWebSocket ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className="text-xs text-cyan-300">
                  {currentDetection?.infer ? `${currentDetection.infer}ms` : "..."}
                </div>
              </div>
              
              {/* Prediction with confidence */}
              <div className={`transition-colors duration-300 ${showPulse ? 'bg-indigo-900/50 rounded p-1' : 'p-1'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400">Prediction:</span>
                  <div>
                    <span className="font-bold text-2xl text-indigo-300">{currentDetection?.pred || "..."}</span>
                    <span className="ml-2 text-yellow-300 text-sm">
                      {currentDetection ? `(${(currentDetection.prob * 100).toFixed(1)}%)` : ""}
                    </span>
                  </div>
                </div>
                
                {/* Confidence bar */}
                {currentDetection && (
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                    <div 
                      className="bg-yellow-400 h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${currentDetection.prob * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              {/* Consecutive detection progress bar (silent UI, just the bar) */}
              {consecutiveThreshold > 0 && currentDetection && (
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${(consecutiveCount / consecutiveThreshold) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Status overlays */}
          {!isCameraReady && !isDetecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
              <p className="text-white text-xl text-center p-4">Camera will start when WebSocket connects.</p>
            </div>
          )}
          
          {isDetecting && !isCameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
              <p className="text-white text-xl text-center p-4">Initializing Camera...</p>
            </div>
          )}
          
          {/* WebSocket Error Modal */}
          {showWebSocketError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="w-full max-w-md p-4 bg-red-900/80 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">Connection Lost</h3>
                <p className="mb-4">The connection to the hand sign recognition service has been lost.</p>
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={closeWebSocketConnectionError}
                    className="px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600"
                  >
                    Dismiss
                  </button>
                  <button 
                    onClick={reconnectWebSocket}
                    className="px-3 py-1 bg-red-600 rounded-md hover:bg-red-500"
                  >
                    Reconnect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HandDetectionCamera; 