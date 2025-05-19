import { io } from "socket.io-client";

const ws_url = process.env.WEBSOCKET_URL || "http://localhost:15100";
export const socket = io(ws_url, { autoConnect: false });

// Debug info
console.log("WebSocket initialized at: ", ws_url);

// Connection state management
let isConnected = false;
let showConnectionError = false;

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
});

socket.on("disconnect", () => {
    console.log("Socket disconnected");
    isConnected = false;
    showConnectionError = true;
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
};

export const reconnect = () => {
    socket.connect();
    showConnectionError = false;
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

