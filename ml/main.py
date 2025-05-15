import socketio
import uvicorn
import os
from dotenv import load_dotenv
from model_handsign import hand_sign_recognizer # New import
from model_autocomplete import auto_complete_model # New import
from utils import log_info, log_warning, log_error, log_received_message, log_sending_message

# Load environment variables from .env file
load_dotenv()

# Initialize Socket.IO server
sio_app = socketio.ASGIApp(socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*"))
sio_server = sio_app.app # This is the socketio.AsyncServer instance

@sio_server.event
async def connect(sid, environ):
    log_info(f"Client {sid} connected. Environ: {environ}")
    ack_data = {'message': 'Successfully connected to ML service!', 'sid': sid}
    log_sending_message(sid, 'connection_ack', ack_data)
    await sio_server.emit('connection_ack', ack_data, room=sid)

@sio_server.event
async def disconnect(sid):
    log_info(f"Client {sid} disconnected")
    # No room cleanup needed as we are not using custom rooms anymore

# Channel for hand sign recognition
@sio_server.on('req_handsign')
async def handle_hand_sign_detection(sid, data):
    log_received_message(sid, 'req_handsign', data)
    landmarks = data.get('landmarks')

    if landmarks is None: # landmarks can be an empty list if no hand detected
        log_warning(f"Client {sid}: 'landmarks' field missing in req_handsign payload. No action taken.")
        return # Silent: Do not emit to client
    
    if not landmarks: # If landmarks list is empty (e.g. no hand detected by client)
        log_info(f"Client {sid}: No landmarks received for hand sign detection. No action taken.")
        return # Silent: Do not emit to client

    try:
        predicted_char = hand_sign_recognizer.predict(landmarks)
    except Exception as e:
        log_error(f"Client {sid}: Error during hand sign prediction: {e}. No action taken for client.")
        return # Silent: Do not emit to client

    if predicted_char is not None:
        response_data = {'prediction': predicted_char}
        log_sending_message(sid, 'res_handsign', response_data)
        await sio_server.emit('res_handsign', response_data, room=sid)
    else:
        log_warning(f"Client {sid}: Hand sign prediction returned None. No action taken for client.")
        # Silent: Do not emit to client

# Channel for auto-completion
@sio_server.on('req_autocomp')
async def handle_auto_completion(sid, data):
    log_received_message(sid, 'req_autocomp', data)
    current_text = data.get('text')

    if current_text is None:
        log_warning(f"Client {sid}: 'text' field missing in req_autocomp payload. No action taken.")
        return # Silent: Do not emit to client

    try:
        suggestions = auto_complete_model.predict(current_text)
        response_data = {'suggestions': suggestions}
        log_sending_message(sid, 'res_autocomp', response_data)
        await sio_server.emit('res_autocomp', response_data, room=sid)
    except Exception as e:
        log_error(f"Client {sid}: Error during auto-completion: {e}. No action taken for client.")
        # Silent: Do not emit to client

if __name__ == "__main__":
    # Load host and port from environment variables with defaults
    host = os.getenv("WEBSOCKET_HOST", "0.0.0.0")
    port = int(os.getenv("WEBSOCKET_PORT", "15100"))

    log_info(f"Starting ML WebSocket server on {host}:{port}")
    # Ensure models are loaded (or at least attempted to load)
    _ = hand_sign_recognizer 
    _ = auto_complete_model
    uvicorn.run("main:sio_app", host=host, port=port, reload=False) 