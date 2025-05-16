import type { Hands } from "@mediapipe/hands";
import type { Camera } from "@mediapipe/camera_utils";
import * as drawingUtils from "@mediapipe/drawing_utils";

type HandsConstructor = new (config?: { locateFile: (file: string) => string }) => Hands;
type CameraConstructor = new (
    videoElement: HTMLVideoElement,
    options: { onFrame: () => Promise<void>; width: number; height: number }
) => Camera;

type HandsModule = {
    Hands: HandsConstructor;
    Camera: CameraConstructor;
    Draw: typeof drawingUtils;
    HAND_CONNECTIONS: drawingUtils.LandmarkConnectionArray;
} | null;

export const loadHandsModule = async (): Promise<HandsModule> => {
    if (typeof window !== "undefined") {
        const { Hands } = await import("@mediapipe/hands");
        const { HAND_CONNECTIONS } = await import("@mediapipe/hands");
        const { Camera } = await import("@mediapipe/camera_utils");
        const Draw = await import("@mediapipe/drawing_utils");
        return { Hands, Camera, Draw, HAND_CONNECTIONS };
    }
    return null;
};