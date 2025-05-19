import pickle
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import os
from dotenv import load_dotenv

from utils import log_info, log_error, log_warning # Assuming utils might be needed for logging within model init

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
        self._model = None
        self._scaler = None
        self._pca = None
        self._pipeline = None
        self._initialize_model()
        self._initialized = True

    def _initialize_model(self):
        try:
            scaler_model_path = os.getenv("SCALER_MODEL_PATH", "./models_store/scaler.pkl")
            pca_model_path = os.getenv("PCA_MODEL_PATH", "./models_store/pca.pkl")
            hand_sign_model_path = os.getenv("HAND_SIGN_MODEL_PATH", "./models_store/rf_model_pca.pkl")

            log_info(f"Loading scaler model from: {scaler_model_path}")
            with open(scaler_model_path, 'rb') as f:
                self._scaler = pickle.load(f)
            
            log_info(f"Loading PCA model from: {pca_model_path}")
            with open(pca_model_path, 'rb') as f:
                self._pca = pickle.load(f)

            log_info(f"Loading hand sign model from: {hand_sign_model_path}")
            with open(hand_sign_model_path, 'rb') as f:
                self._model = pickle.load(f)

            self._pipeline = Pipeline([
                ('scaler', self._scaler),
                ('pca', self._pca),
                ('model', self._model)
            ])
            log_info("Hand Sign Recognizer pipeline loaded successfully.")

        except FileNotFoundError as e:
            log_error(f"Error loading model components for HandSignRecognizer: {e}. Please ensure model files are at specified paths in .env (e.g., SCALER_MODEL_PATH).")
            self._pipeline = None
        except Exception as e:
            log_error(f"An unexpected error occurred during HandSignRecognizer model initialization: {e}")
            self._pipeline = None
            
    def _preprocess_landmarks(self, landmarks_data: list[dict]) -> pd.DataFrame | None:
        if not landmarks_data or not isinstance(landmarks_data, list):
            log_warning("Landmarks data is empty or not a list in _preprocess_landmarks.")
            return None
        
        # Ensure all expected features are present, even if None, for consistent DataFrame columns
        expected_coords = ['x', 'y', 'z']
        
        # Ensure feature_dict has this exact structure
        # [f'landmark_{i}_x' for i in range(21)] + [f'landmark_{i}_y' for i in range(21)] + [f'landmark_{i}_z' for i in range(21)]

        feature_dict = {f'landmark_{i}_{coord}': landmarks_data[i].get(coord) for coord in expected_coords for i in range(21) }
        
        df = pd.DataFrame([feature_dict])
        
        # Check for any missing values that could cause issues with scaler/pca
        if df.isnull().values.any():
            log_warning(f"DataFrame contains null values after preprocessing: \n{df[df.isnull().any(axis=1)]}")
            # Depending on model tolerance, might return None or try to impute
            # For now, we proceed, but this is a point of potential failure if scaler/pca can't handle NaNs
        return df

    def predict(self, landmarks_data: list[dict]) -> tuple[str, float] | None:
        if self._pipeline is None:
            log_error("HandSignRecognizer pipeline is not loaded. Cannot predict.")
            return None
        if not landmarks_data:
            log_warning("Received empty landmarks_data for prediction.")
            return None # Or a specific code for no input

        processed_data = self._preprocess_landmarks(landmarks_data)
        
        if processed_data is None:
            log_warning("Failed to preprocess landmarks. Cannot predict.")
            return None

        try:
            prediction_array = self._pipeline.predict_proba(processed_data)
            y_single_pred = np.argmax(prediction_array, axis=1)
            max_prob = 1/(1+np.exp(-prediction_array[0][y_single_pred[0]]))
            pred_char = ""
            if y_single_pred[0] == 0:
                pred_char = "delete"
            elif y_single_pred[0] == 27:
                pred_char = "space"
            else:
                pred_char = chr(y_single_pred[0] + ord("A") - 1)
            
            return pred_char, max_prob
        except Exception as e:
            log_error(f"Error during prediction pipeline: {e}")
            return None

# Instantiate the singleton for use in other modules
hand_sign_recognizer = HandSignRecognizer() 