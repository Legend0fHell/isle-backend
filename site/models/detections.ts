export interface DetectedSignCreate {
  user_email: string;
  detected_character: string;
  current_user_text: string;
  image_data?: string[];
}

export interface DetectedSign {
  detection_id: string;
  user_id: string;
  detected_character: string;
  current_user_text: string;
  image_data?: string[];
  created_at: string;
}

export interface AutoSuggest {
  suggest_id: string;
  detection_id: string;
  suggested_text: string;
  created_at: string;
}

export interface Quickfix {
  quickfix_id: string;
  detection_id: string;
  fix_text: string;
  created_at: string;
}

export interface FullDetectionResult {
  detection: DetectedSign;
  auto_suggest: AutoSuggest;
  quickfix: Quickfix;
}

/**
 * Gửi dữ liệu nhận dạng tín hiệu tay và nhận các đề xuất từ API
 * @param detectedSign Thông tin tín hiệu tay được phát hiện
 * @returns Kết quả đầy đủ bao gồm detection, auto_suggest và quickfix
 */
export async function sendDetection(detectedSign: DetectedSignCreate): Promise<FullDetectionResult> {
  try {
    const response = await fetch('/api/detections/suggests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(detectedSign),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process detection');
    }

    const result: FullDetectionResult = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending detection data:', error);
    throw error;
  }
}

/**
 * Chuyển đổi dữ liệu landmarks từ MediaPipe thành chuỗi để gửi đến API
 * @param landmarks Dữ liệu landmarks từ MediaPipe
 * @returns Chuỗi biểu diễn của landmarks
 */
export function formatLandmarksForAPI(landmarks: any): string | null {
  if (!landmarks || !landmarks.length) return null;
  
  // Chuyển đổi mảng landmarks thành định dạng phù hợp
  try {
    // Format landmarks theo yêu cầu của API
    return JSON.stringify(landmarks);
  } catch (error) {
    console.error('Error formatting landmarks:', error);
    return null;
  }
}

/**
 * Lấy dữ liệu hình ảnh từ canvas để gửi đến API
 * @param canvas Canvas chứa hình ảnh cần xử lý
 * @returns Base64 string của hình ảnh
 */
export function getImageDataFromCanvas(canvas: HTMLCanvasElement | null): string | null {
  if (!canvas) return null;
  
  try {
    // Lấy dữ liệu hình ảnh từ canvas dưới dạng base64
    return canvas.toDataURL('image/jpeg', 0.7); // Nén với chất lượng 70%
  } catch (error) {
    console.error('Error getting image data from canvas:', error);
    return null;
  }
}