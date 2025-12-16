import { io } from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

const socket = io(API_URL, {
    transports: ["polling", "websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
});

socket.on("connect", () => {
    console.log("🟢 Connected to Socket.IO server:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("🔴 Socket connection error:", err.message);
});

export default socket;