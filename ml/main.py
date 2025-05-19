import json
import time
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
sio_server = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")
sio_app = socketio.ASGIApp(sio_server)

verbose_str = os.getenv("VERBOSE", "True")
verbose = True if verbose_str.lower() == "true" else False

@sio_server.event
async def connect(sid, environ):
    log_info(f"Client {sid} connected", verbose)
    ack_data = {'message': 'Successfully connected to ML service!', 'sid': sid}
    log_sending_message(sid, 'connection_ack', ack_data, verbose)
    await sio_server.emit('connection_ack', ack_data, room=sid)

@sio_server.event
async def disconnect(sid):
    log_info(f"Client {sid} disconnected", verbose)
    # No room cleanup needed as we are not using custom rooms anymore

# Channel for hand sign recognition
@sio_server.on('req_handsign')
async def handle_hand_sign_detection(sid, data):
    log_received_message(sid, 'req_handsign', data, verbose)
    # Save the timestamp of the request in milliseconds
    start_time = time.time() * 1000
    
    landmarks = data.get('landmarks')

    if landmarks is None: # landmarks can be an empty list if no hand detected
        log_warning(f"Client {sid}: 'landmarks' field missing in req_handsign payload. No action taken.", verbose)
        return # Silent: Do not emit to client
    
    if not landmarks: # If landmarks list is empty (e.g. no hand detected by client)
        log_info(f"Client {sid}: No landmarks received for hand sign detection. No action taken.", verbose)
        return # Silent: Do not emit to client

    try:
        predicted_char, max_prob = hand_sign_recognizer.predict(landmarks)
    except Exception as e:
        log_error(f"Client {sid}: Error during hand sign prediction: {e}. No action taken for client.", verbose)
        return # Silent: Do not emit to client

    if max_prob < 0.2:
        log_warning(f"Client {sid}: Hand sign prediction probability is too low ({max_prob}). No action taken for client.", verbose)
        return # Silent: Do not emit to client

    # Calculate the inference time in milliseconds
    inference_time = time.time() * 1000 - start_time
    if predicted_char is not None:
        response_data = {'time': int(start_time), 'pred': predicted_char, 'prob': max_prob, 'infer': int(inference_time)}
        log_sending_message(sid, 'res_handsign', response_data, verbose)
        await sio_server.emit('res_handsign', response_data, room=sid)
    else:
        log_warning(f"Client {sid}: Hand sign prediction returned None. No action taken for client.", verbose)
        # Silent: Do not emit to client

# Channel for auto-completion
@sio_server.on('req_autocomp')
async def handle_auto_completion(sid, data):
    log_received_message(sid, 'req_autocomp', data, verbose)
    current_text = data.get('text')

    if current_text is None:
        log_warning(f"Client {sid}: 'text' field missing in req_autocomp payload. No action taken.", verbose)
        return # Silent: Do not emit to client

    try:
        suggestions = auto_complete_model.predict(current_text)
        response_data = {'suggestions': suggestions}
        log_sending_message(sid, 'res_autocomp', response_data, verbose)
        await sio_server.emit('res_autocomp', response_data, room=sid)
    except Exception as e:
        log_error(f"Client {sid}: Error during auto-completion: {e}. No action taken for client.", verbose)
        # Silent: Do not emit to client

if __name__ == "__main__":
    # Load host and port from environment variables with defaults
    host = os.getenv("WEBSOCKET_HOST", "0.0.0.0")
    port = int(os.getenv("WEBSOCKET_PORT", "15100"))

    log_info(f"Starting ML WebSocket server on {host}:{port}")
    log_info(f"Verbose logging: {verbose}", verbose)
    # Ensure models are loaded (or at least attempted to load)

    _ = hand_sign_recognizer 
    _ = auto_complete_model
    uvicorn.run("main:sio_app", host=host, port=port, reload=False) 