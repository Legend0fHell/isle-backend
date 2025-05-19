# ISLE ML WebSocket Service

This service provides AI/ML functionalities for the ISLE platform via WebSockets, primarily focusing on hand sign recognition and offering an interface for auto-completion features.

### Connection

*   Upon successful connection, the server emits a `connection_ack` event to the client:
    ```json
    { "message": "Successfully connected to ML service!", "sid": "client_session_id" }
    ```

### Disconnection

*   When a client disconnects, the server logs the event. No explicit cleanup is required from the client.

### Channels

1.  **Hand Sign Recognition**
    *   **Client emits**: `req_handsign`
    *   **Payload**:
        ```json
        {
            "landmarks": [
                { "x": 0.5, "y": 0.5, "z": 0.0 },
                // ... 20 more landmarks
            ]
        }
        ```
    *   **Server emits**: `res_handsign` (on successful prediction with valid landmarks)
    *   **Payload**:
        ```json
        {
            'time': 1747653061912,      // Received timestamp (in ms)
            'pred': 'F',                // Prediction result
            'prob': 1.0,                // Probability
            'infer': 28                 // Inference time (in ms)
        }
        ```
    *   **Note**: If landmarks are missing, empty, or an error occurs during prediction, the server logs the issue but does *not* send an error message or an empty prediction to the client.

2.  **Auto-Completion**
    *   **Client emits**: `req_autocomp`
    *   **Payload**:
        ```json
        { "text": "current input te" }
        ```
    *   **Server emits**: `res_autocomp` (on successful suggestion generation)
    *   **Payload**:
        ```json
        { "suggestions": ["current input text", "current input testing"] }
        ```
    *   **Note**: If the text field is missing or an error occurs, the server logs the issue but does *not* send an error message to the client.

### Error Handling (Server-Side Logging)

*   In cases of missing data (e.g., no landmarks, no text for auto-completion) or internal prediction errors, the server will log these events with details.
*   No explicit error messages are sent back to the client via WebSocket for these specific scenarios to maintain a cleaner communication channel focused on successful results.
*   Generic WebSocket connection issues will be handled by standard WebSocket error mechanisms on the client side.

## Setup and Running

1.  **Model Files**: Ensure the following model files are present in the `ml/models_store/` directory before building/running the service:
    *   `rf_model_pca.pkl`: The trained Random Forest classifier model.
    *   `pca.pkl`: The PCA model used for dimensionality reduction.
    *   `scaler.pkl`: The scaler model used for feature scaling.
2.  **Environment Variables**: Create a `.env` file in the project root (based on `.env.example`) and configure:
    *   `WEBSOCKET_HOST`
    *   `WEBSOCKET_PORT`
    *   `HAND_SIGN_MODEL_PATH`
    *   `PCA_MODEL_PATH`
    *   `SCALER_MODEL_PATH`
    *   `VERBOSE`

4.  **Run Server (Docker)**:
    *   Build: `docker-compose build ml`
    *   Run: `docker-compose up ml` (or `docker-compose up` for all services)
5.  **Run Server (Local Development)**:
    *   Change directory to this folder: `cd ml`
    *   Ensure local files exist:
        1. `.env` file is being initialized. The example file is `.env.example`.
        2. Model files are in `models_store` (location in `.env`). There should be 3 files.
    *   Install requirements: `pip install -r requirements.txt`
    *   Run the server: `python main.py`

## Notes

*   The `HandSignRecognizer` and `AutoCompleteModel` are loaded as singletons when their respective modules are imported (typically at server startup).
*   Communication is direct between client and server using the client's session ID (`sid`).