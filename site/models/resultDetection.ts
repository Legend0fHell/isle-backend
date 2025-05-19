/**
 * Types and utilities for hand sign detection results
 */

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
export function formatLandmarksForWebSocket(landmarks: any[]): { landmarks: any[] } | null {
  if (!landmarks || !landmarks.length) return null;
  
  try {
    const firstHandLandmarks = landmarks[0]; // Use first hand's landmarks
    // only accept x, y, z coordinates
    const formattedLandmarks = firstHandLandmarks.map((landmark: any) => ({
      x: landmark.x,
      y: landmark.y,
      z: landmark.z
    }));
    return { landmarks: formattedLandmarks };
  } catch (error) {
    console.error('Error formatting landmarks for WebSocket:', error);
    return null;
  }
} 