import cv2				# Import OpenCV for image processing
import sys				# Import for time
import os				# Import for reading files
import threading		# Import for separate thread for image classification
import numpy as np 		# Import for converting vectors

from mediapipe import solutions
from mediapipe.framework.formats import landmark_pb2
import pandas as pd

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

base_options = python.BaseOptions(model_asset_buffer=open('hand_landmarker.task', "rb").read())
options = vision.HandLandmarkerOptions(base_options=base_options, 
                                       running_mode=vision.RunningMode.IMAGE,
                                       num_hands=1,
                                       min_hand_detection_confidence=0.3,
                                       min_hand_presence_confidence=0.3)
lmker = vision.HandLandmarker.create_from_options(options)

def process_image(img, label, debug=False):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=img)
    
    detection_results = lmker.detect(mp_img)

    if debug:
        annotated_image = draw_landmarks_on_image(mp_img.numpy_view(), detection_results)
        cv2.imshow('', cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB))

    hand_landmarks_list = detection_results.hand_landmarks

    if len(hand_landmarks_list) == 0:
        if debug:
            print(f'No hands detected!')
        return (None, 1)
    
    hand_landmarks = hand_landmarks_list[0]
    handedness = (detection_results.handedness[0])[0].category_name

    # Add handedness and label (assuming label is available)
    new_row = {
        'label': label,
        'handedness': True if handedness == 'Right' else False
    }
    new_row.update({f'landmark_{i}_x': landmark.x for (i, landmark) in enumerate(hand_landmarks)})
    new_row.update({f'landmark_{i}_y': landmark.y for (i, landmark) in enumerate(hand_landmarks)})
    new_row.update({f'landmark_{i}_z': landmark.z for (i, landmark) in enumerate(hand_landmarks)})

    # Append new row efficiently
    new_row_df = pd.DataFrame([new_row])
    total_distance = 0
    for i in range(1, 21):
        total_distance += np.sqrt((new_row_df[f'landmark_{i}_x'][0] - new_row_df[f'landmark_{i-1}_x'][0])**2 +
                                    (new_row_df[f'landmark_{i}_y'][0] - new_row_df[f'landmark_{i-1}_y'][0])**2 +
                                    (new_row_df[f'landmark_{i}_z'][0] - new_row_df[f'landmark_{i-1}_z'][0])**2)
    if debug:
        print(total_distance)
    if total_distance < 1.3:
        if debug:
            print(f'False detection', end='\r')
        
        return (None, 2)

    return (new_row_df, 0)


MARGIN = 5  # pixels
FONT_SIZE = 0.5
FONT_THICKNESS = 1
HANDEDNESS_TEXT_COLOR = (88, 205, 54) # vibrant green

def draw_landmarks_on_image(rgb_image, detection_result):
  hand_landmarks_list = detection_result.hand_landmarks

  handedness_list = detection_result.handedness
  annotated_image = np.copy(rgb_image)

  # Loop through the detected hands to visualize.
  for idx in range(len(hand_landmarks_list)):
    hand_landmarks = hand_landmarks_list[idx]
    handedness = handedness_list[idx]

    # Draw the hand landmarks.
    hand_landmarks_proto = landmark_pb2.NormalizedLandmarkList()
    hand_landmarks_proto.landmark.extend([
      landmark_pb2.NormalizedLandmark(x=landmark.x, y=landmark.y, z=landmark.z) for landmark in hand_landmarks
    ])
    solutions.drawing_utils.draw_landmarks(
      annotated_image,
      hand_landmarks_proto,
      solutions.hands.HAND_CONNECTIONS,
      solutions.drawing_styles.get_default_hand_landmarks_style(),
      solutions.drawing_styles.get_default_hand_connections_style())

    # Get the top left corner of the detected hand's bounding box.
    height, width, _ = annotated_image.shape
    x_coordinates = [landmark.x for landmark in hand_landmarks]
    y_coordinates = [landmark.y for landmark in hand_landmarks]
    text_x = int(min(x_coordinates) * width)
    text_y = int(min(y_coordinates) * height) - MARGIN

    # Draw handedness (left or right hand) on the image.
    cv2.putText(annotated_image, f"{handedness[0].category_name}",
                (text_x, text_y), cv2.FONT_HERSHEY_DUPLEX,
                FONT_SIZE, HANDEDNESS_TEXT_COLOR, FONT_THICKNESS, cv2.LINE_AA)

  return annotated_image

def augment_data(data):
    """
    Augment the data of 21 landmarks with:
    - Random horizontal flipping
    - Random rotation (5-20 degrees)
    - Random movement/jittering (by 1e-3, 1e-2)
    
    Args:
        data: DataFrame row containing landmark data
        label: The label for this data
        
    Returns:
        DataFrame with original and augmented data
    """
    augmented_data = [data.copy()]  # Start with the original data
    
    # Create a copy for horizontal flipping
    flipped_data = data.copy()
    
    # Horizontal flip (x becomes 1-x)
    for i in range(21):
        flipped_data[f'landmark_{i}_x'] *= -1

    augmented_data.append(flipped_data)
    
    # Random rotations
    rotation_angles = [np.random.uniform(5, 20) * (np.pi/180) for _ in range(3)]  # Convert to radians
    for angle in rotation_angles:
        rotated_data = data.copy()
        
        # Calculate centroid of landmarks to use as rotation center
        x_center = sum(data[f'landmark_{i}_x'] for i in range(21)) / 21
        y_center = sum(data[f'landmark_{i}_y'] for i in range(21)) / 21
        
        # Rotation matrix application
        for i in range(21):
            x = data[f'landmark_{i}_x'] - x_center
            y = data[f'landmark_{i}_y'] - y_center
            
            # Apply rotation
            rotated_x = x * np.cos(angle) - y * np.sin(angle)
            rotated_y = x * np.sin(angle) + y * np.cos(angle)
            
            # Translate back
            rotated_data[f'landmark_{i}_x'] = rotated_x + x_center
            rotated_data[f'landmark_{i}_y'] = rotated_y + y_center
        
        augmented_data.append(rotated_data)
    
    # Random movement/jittering
    for _ in range(3):
        jittered_data = data.copy()
        
        # Add small random offsets
        for i in range(21):
            jittered_data[f'landmark_{i}_x'] += np.random.uniform(-0.01, 0.01)
            jittered_data[f'landmark_{i}_y'] += np.random.uniform(-0.01, 0.01)
            jittered_data[f'landmark_{i}_z'] += np.random.uniform(-0.01, 0.01)
            
            # Ensure values stay in reasonable bounds
            jittered_data[f'landmark_{i}_x'] = np.clip(jittered_data[f'landmark_{i}_x'], 0.0, 1.0)
            jittered_data[f'landmark_{i}_y'] = np.clip(jittered_data[f'landmark_{i}_y'], 0.0, 1.0)
            
        augmented_data.append(jittered_data)
    
    # Combine original and augmented data
    return pd.concat(augmented_data, axis=0, ignore_index=True)


if __name__ == "__main__":
    # Get a live stream from the webcam
    live_stream = cv2.VideoCapture(0)

    # Word for which letters are currently being signed
    label = ord('T') - ord('A')

    # Global variable to keep track of time
    time_counter = 0

    # Flag to check if 'c' is pressed
    captureFlag = False

    # Toggle real time processing
    realTime = True

    # Toggle spell checking
    spell_check = False

    final_data = pd.DataFrame()


    # Infinite loop
    while True:

        # Display live feed until ESC key is pressed
        # Press ESC to exit
        keypress = cv2.waitKey(1)
        
        # Read a single frame from the live feed
        img = live_stream.read()[1]

        # Set a region of interest
        cv2.rectangle(img, (70, 70), (350, 350), (0,255,0), 2)

        # Show the live stream
        cv2.imshow("Live Stream", img)
        try:
            # 'C' is pressed
            if keypress == ord('x'):
                img_crop = img[70:350, 70:350]
                row = process_image(img_crop, label, debug=True)
                if row[1] != 0:
                    print(f'Error: {row[1]}')
                    continue
                augmented_data = augment_data(row[0])
                final_data = pd.concat([final_data, augmented_data], ignore_index=True)
                
                print(f'Captured {len(final_data)} frames!')
            
            if keypress == ord('z'):
                # Undo the last capture
                if len(final_data) > 0:
                    final_data = final_data[:-8]
                    print(f'Undid last capture. {len(final_data)} frames remaining!')
                else:
                    print('No frames to undo!')
            
            if keypress == ord('c'):
                # Save the data to a CSV file
                if len(final_data) > 0:
                    final_data.to_csv('hand_sign_new_data.csv', index=False)
                    print(f'Saved {len(final_data)} frames to hand_sign_data.csv!')
                else:
                    print('No frames to save!')
        except Exception as e:
            print(f'Error: {e}')
            final_data.to_csv('hand_sign_new_data.csv', index=False)
            print(f'Saved {len(final_data)} frames to hand_sign_data.csv!')

        # If ESC is pressed
        if keypress == 27:
            break

        # Update time
        time_counter = time_counter + 1

    # Stop using camers
    live_stream.release()

    # Destroy windows created by OpenCV
    cv2.destroyAllWindows()