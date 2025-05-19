import datetime

def _get_timestamp():
    return datetime.datetime.now().isoformat()

def log_info(message: str, verbose: bool = True):
    if verbose:
        print(f"[{_get_timestamp()}] INFO: {message}")

def log_warning(message: str, verbose: bool = True):
    if verbose:
        print(f"[{_get_timestamp()}] WARNING: {message}")

def log_error(message: str, verbose: bool = True):
    if verbose:
        print(f"[{_get_timestamp()}] ERROR: {message}")

def log_received_message(sid: str, event: str, data: any, verbose: bool = True):
    if verbose:
        log_info(f"Client {sid} | Event '{event}' | Data: {str(data)[-100:]}")

def log_sending_message(sid: str, event: str, data: any, verbose: bool = True):
    if verbose:
        log_info(f"To {sid} | Event '{event}' | Data: {str(data)[-100:]}") 