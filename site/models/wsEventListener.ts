import { io } from "socket.io-client";

const ws_url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

// Create socket with explicit transport settings and reconnection options
export const socket = io(ws_url, { 
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    transports: ['websocket', 'polling'] // Try websocket first, fall back to polling
});

// Debug info
console.log("WebSocket initialized at: ", ws_url);

// Connection state management
let isConnected = false;
let showConnectionError = false;
let connectionAttempts = 0;
const MAX_RECONNECTION_ATTEMPTS = 5;

// Observer pattern - subscribers will be notified when connection state changes
type ConnectionStateListener = (state: { isConnected: boolean; showConnectionError: boolean }) => void;
const listeners: ConnectionStateListener[] = [];

// Function to subscribe to connection state changes
export const subscribeToConnectionState = (listener: ConnectionStateListener) => {
    listeners.push(listener);
    // Immediately notify the new listener of current state
    listener({ isConnected, showConnectionError });
    
    // Return unsubscribe function
    return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    };
};

// Helper to notify all listeners of state changes
const notifyListeners = () => {
    const state = { isConnected, showConnectionError };
    listeners.forEach(listener => listener(state));
};

// Expose connection state
export const getConnectionState = () => ({
    isConnected,
    showConnectionError
});

// Set up connection event handlers
socket.on("connect", () => {
    console.log("Socket connected with ID:", socket.id);
    isConnected = true;
    showConnectionError = false;
    connectionAttempts = 0;
    notifyListeners();
});

socket.on("disconnect", (reason) => {
    console.log("Socket disconnected. Reason:", reason);
    isConnected = false;
    
    // Don't show error for normal disconnects
    if (reason === 'io client disconnect' || reason === 'io server disconnect') {
        showConnectionError = false;
    } else {
        connectionAttempts++;
        showConnectionError = connectionAttempts >= MAX_RECONNECTION_ATTEMPTS;
    }
    
    notifyListeners();
});

socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
    connectionAttempts++;
    isConnected = false;
    showConnectionError = connectionAttempts >= MAX_RECONNECTION_ATTEMPTS;
    notifyListeners();
    
    // Attempt to reconnect with a delay
    if (connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
        setTimeout(() => {
            if (!socket.connected) {
                console.log(`Reconnection attempt ${connectionAttempts}...`);
                socket.connect();
            }
        }, 2000);
    }
});

socket.on("connection_ack", (data) => {
    console.log("Connection established: ", data);
});

socket.on("res_handsign", (data) => {
    console.log("Handsign data received: ", data);
});

socket.on("res_autocomp", (data) => {
    console.log("Auto-complete data received: ", data);
});

// Connection management functions
export const closeConnectionError = () => {
    showConnectionError = false;
    notifyListeners();
};

export const reconnect = () => {
    // Reset connection attempts on manual reconnect
    connectionAttempts = 0;
    
    // Ensure we're not already connected
    if (socket.connected) {
        socket.disconnect();
    }
    
    // Small delay to ensure clean disconnect before reconnecting
    setTimeout(() => {
        socket.connect();
        showConnectionError = false;
        notifyListeners();
    }, 500);
};

// Utility to ensure socket is connected
export const ensureSocketConnected = () => {
    if (!socket.connected) {
        socket.connect();
    }
    return socket.connected;
};

// Connect socket when this module is imported
// Add small delay to ensure browser environment is ready
setTimeout(() => {
    ensureSocketConnected();
}, 100);

