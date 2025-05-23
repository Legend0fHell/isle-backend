/**
 * Types and utilities for hand sign detection results
 */

// Define a type for landmarks used by MediaPipe
export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

// Define a type for raw landmark input to handle the MediaPipe format
export interface RawLandmark {
  x?: number | null;
  y?: number | null;
  z?: number | null;
  // Use unknown instead of any for better type safety
  [key: string]: unknown;
}

// Type for landmarks array from MediaPipe
export type MediaPipeLandmarks = (HandLandmark | RawLandmark)[][];

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
export function formatLandmarksForWebSocket(landmarks: MediaPipeLandmarks): { landmarks: HandLandmark[] } | null {
  if (!landmarks || !landmarks.length) {
    console.warn('No landmarks provided');
    return null;
  }
  
  try {
    // Get the first hand's landmarks
    const firstHandLandmarks = landmarks[0];
    
    if (!Array.isArray(firstHandLandmarks) || firstHandLandmarks.length === 0) {
      console.warn('Invalid landmarks format');
      return null;
    }
    
    // Ensure landmarks are in the correct format with x, y, z properties
    const formattedLandmarks = firstHandLandmarks.map((landmark): HandLandmark => ({
      x: typeof landmark.x === 'number' ? landmark.x : 0,
      y: typeof landmark.y === 'number' ? landmark.y : 0,
      z: typeof landmark.z === 'number' ? landmark.z : 0
    }));
    
    // Verify we have exactly 21 landmarks (MediaPipe hand landmark model has 21 points)
    if (formattedLandmarks.length !== 21) {
      console.warn(`Expected 21 landmarks, got ${formattedLandmarks.length}`);
    }
    
    return { landmarks: formattedLandmarks };
  } catch (error) {
    console.error('Error formatting landmarks for WebSocket:', error);
    return null;
  }
} 