import { io } from "socket.io-client";

const ws_url = process.env.WEBSOCKET_URL || "http://localhost:15100";
export const socket = io(ws_url, { autoConnect: false });

// Debug info
console.log("WebSocket initialized at: ", ws_url);

// Connection state management
let isConnected = false;
let showConnectionError = false;

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
    console.log("Socket connected");
    isConnected = true;
    showConnectionError = false;
    notifyListeners();
});

socket.on("disconnect", () => {
    console.log("Socket disconnected");
    isConnected = false;
    showConnectionError = true;
    notifyListeners();
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
    socket.connect();
    showConnectionError = false;
    notifyListeners();
};

// Connect socket when this module is imported
socket.connect();

// Utility to ensure socket is connected
export const ensureSocketConnected = () => {
    if (!socket.connected) {
        socket.connect();
    }
    return socket.connected;
};

