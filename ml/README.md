# ISLE ML WebSocket Service

This service provides AI/ML functionalities for the ISLE platform via WebSockets, primarily focusing on hand sign recognition and offering an interface for auto-completion features.

## Functionalities

1.  **Hand Sign Recognition**
    *   **Input**: Expects an array of 21 hand landmark objects, where each object contains `x`, `y`, and `z` coordinates.
    *   **Process**: The landmarks are scaled, transformed using PCA, and then fed into a pre-trained Random Forest Classifier.
    *   **Output**: Predicts the character (A-Z, or special characters like 'space', 'del') represented by the hand sign.

2.  **Auto-Completion (Interface)**
    *   Currently a placeholder interface. It accepts text input and is designed to return potential auto-completion suggestions.
    *   The underlying model for this is not yet fully implemented and returns dummy suggestions.

## WebSocket API

The ML service exposes a WebSocket API for real-time communication. Clients should connect to the Nginx endpoint, which proxies to this service.

*   **Server Address (via Nginx)**: `ws://<your_nginx_host_or_domain>/ml/`
    *   Example (local development): `ws://localhost/ml/`
*   **Underlying Socket.IO path proxied**: Nginx routes `/ml/` to the ML service's `/socket.io/` path.

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
        { "prediction": "A" } 
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
3.  **Dependencies**: Ensure `python-dotenv` and other dependencies from `ml/requirements.txt` are installed. If using Docker, this is handled by the `ml/Dockerfile`.
4.  **Run Server (Docker)**:
    *   Build: `docker-compose build ml`
    *   Run: `docker-compose up ml` (or `docker-compose up` for all services)
5.  **Run Server (Local Development, ensure models are in `ml/models_store` as per .env paths)**:
    *   Install requirements: `pip install -r ml/requirements.txt`
    *   Run: `python ml/main.py`

## Notes

*   The `HandSignRecognizer` and `AutoCompleteModel` are loaded as singletons when their respective modules are imported (typically at server startup).
*   Communication is direct between client and server using the client's session ID (`sid`).