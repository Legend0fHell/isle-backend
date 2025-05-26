import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
import os
from dotenv import load_dotenv

from utils import log_info, log_error, log_warning

# Load environment variables from .env file
# This ensures that if this module is imported, .env is loaded.
# It might be loaded multiple times if other modules also call it, but python-dotenv handles this gracefully.
load_dotenv()

class HandSignRecognizer:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(HandSignRecognizer, cls).__new__(cls, *args, **kwargs)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._scaler: StandardScaler | None = None
        self._interpreter: tf.lite.Interpreter | None = None
        self._input_details = None
        self._output_details = None
        self._initialize_model()
        self._initialized = True

    def _initialize_model(self):
        try:
            # Get paths from environment variables with fallback defaults
            scaler_model_path = os.getenv("SCALER_MODEL_PATH", "./models_store/scaler.pkl")
            tflite_model_path = os.getenv("TFLITE_MODEL_PATH", "./models_store/model.tflite")
            
            # Load scaler
            log_info(f"Loading scaler model from: {scaler_model_path}")
            with open(scaler_model_path, 'rb') as f:
                self._scaler = pickle.load(f)
            
            # Load TFLite model
            log_info(f"Loading TFLite model from: {tflite_model_path}")
            self._interpreter = tf.lite.Interpreter(model_path=tflite_model_path)
            self._interpreter.allocate_tensors()
            
            # Get input and output details
            self._input_details = self._interpreter.get_input_details()
            self._output_details = self._interpreter.get_output_details()
            
            log_info("Hand Sign Recognizer TFLite model loaded successfully.")
            
        except FileNotFoundError as e:
            log_error(f"Error loading model components for HandSignRecognizer: {e}. Please ensure model files are at specified paths in .env")
            self._interpreter = None
        except Exception as e:
            log_error(f"An unexpected error occurred during HandSignRecognizer model initialization: {e}")
            self._interpreter = None
            
    def _preprocess_landmarks(self, landmarks_data: list[dict]) -> pd.DataFrame | None:
        if not landmarks_data or not isinstance(landmarks_data, list):
            log_warning("Landmarks data is empty or not a list in _preprocess_landmarks.")
            return None
        
        # Ensure all expected features are present, even if None, for consistent DataFrame columns
        expected_coords = ['x', 'y', 'z']
        
        # Create feature dictionary with expected structure
        feature_dict = {f'landmark_{i}_{coord}': landmarks_data[i].get(coord) for coord in expected_coords for i in range(21)}
        
        df = pd.DataFrame([feature_dict])
        
        # Check for any missing values that could cause issues with scaler
        if df.isnull().values.any():
            log_warning(f"DataFrame contains null values after preprocessing: \n{df[df.isnull().any(axis=1)]}")
        
        return df

    def predict(self, landmarks_data: list[dict]) -> tuple[str, float] | None:
        if self._interpreter is None or self._scaler is None:
            log_error("HandSignRecognizer model or scaler not loaded. Cannot predict.")
            return None
        
        if not landmarks_data:
            log_warning("Received empty landmarks_data for prediction.")
            return None

        try:
            # Preprocess input data
            processed_data = self._preprocess_landmarks(landmarks_data)
            if processed_data is None:
                log_warning("Failed to preprocess landmarks. Cannot predict.")
                return None
                
            # Scale the data using the loaded scaler
            scaled_data = self._scaler.transform(processed_data)
            
            # Convert to float32 for TFLite
            input_data = np.array(scaled_data, dtype=np.float32)
            
            # Set the input tensor
            self._interpreter.set_tensor(self._input_details[0]['index'], input_data)
            
            # Run inference
            self._interpreter.invoke()
            
            # Get the output tensor
            prediction_array = self._interpreter.get_tensor(self._output_details[0]['index'])
            
            # Find the class with highest probability
            y_single_pred = np.argmax(prediction_array, axis=1)
            
            # Get the confidence value (max probability)
            max_prob = prediction_array[0][y_single_pred[0]]
            
            # Convert numeric prediction to character
            pred_char = ""
            if y_single_pred[0] == 26:
                pred_char = "delete"
            elif y_single_pred[0] == 27:
                pred_char = "space"
            elif y_single_pred[0] == 28:
                pred_char = "autocmp"
            else:
                pred_char = chr(y_single_pred[0] + ord("A"))
                
            return pred_char, float(max_prob)
            
        except Exception as e:
            log_error(f"Error during prediction: {e}")
            return None

# Instantiate the singleton for use in other modules
hand_sign_recognizer = HandSignRecognizer() 