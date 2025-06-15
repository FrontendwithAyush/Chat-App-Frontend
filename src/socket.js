// src/socket.js
import { io } from "socket.io-client";

// const socket = io("http://localhost:5000"); // update this if deployed
const socket = io("https://chat-app-backend-yloe.onrender.com");
export default socket;
