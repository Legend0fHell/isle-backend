/**
 * Types and utilities for hand sign detection results
 */

// Define a type for landmarks used by MediaPipe
export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

/**
 * Response from the WebSocket server for hand sign detection
 */
export interface HandSignResponse {
  time: number;    // Received timestamp (in ms)
  pred: string;    // Prediction result
  prob: number;    // Probability
  infer: number;   // Inference time (in ms)
}

/**
 * Format hand landmarks from MediaPipe for the WebSocket API
 * @param landmarks Array of hand landmarks from MediaPipe
 * @returns Object with landmarks in the format expected by the WebSocket API
 */
export function formatLandmarksForWebSocket(landmarks: HandLandmark[][]): { landmarks: HandLandmark[] } | null {
  if (!landmarks || !landmarks.length) return null;
  
  try {
    const firstHandLandmarks = landmarks[0]; // Use first hand's landmarks
    return { landmarks: firstHandLandmarks };
  } catch (error) {
    console.error('Error formatting landmarks for WebSocket:', error);
    return null;
  }
} 