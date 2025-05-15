import datetime

def _get_timestamp():
    return datetime.datetime.now().isoformat()

def log_info(message: str):
    print(f"[{_get_timestamp()}] INFO: {message}")

def log_warning(message: str):
    print(f"[{_get_timestamp()}] WARNING: {message}")

def log_error(message: str):
    print(f"[{_get_timestamp()}] ERROR: {message}")

def log_received_message(sid: str, event: str, data: any):
    log_info(f"Client {sid} | Event '{event}' | Data: {data}")

def log_sending_message(sid: str, event: str, data: any):
    log_info(f"To {sid}   | Event '{event}' | Data: {data}") 