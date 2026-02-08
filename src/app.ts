import express from "express";
import corsMiddleware from "./middlewares/cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.routes";
import "./models/associations";
import { createServer } from "http";
import { askGPT, setupSocket } from "./services/chat.service";
import path from "path";
import axios from "axios";
// import otpRoutes from "./routes/otp.router";

const app = express();

// Middlewares
app.use("/uploads", express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);


// Routes
// Health Check
app.get("/api/health", (_, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)


// app.use("/api/ask-gpt", askGPT);
// app.use("/api/otp", otpRoutes)





//Chat Socket
// import http from 'http'
// import {
//     Server
// } from 'socket.io';
// const chatServer = http.createServer(app)
// const io = new Server(chatServer, {
//     cors: {
//         origin: '*', // In production, specify your domain
//         methods: ['GET', 'POST'],
//     },
// });

// Store messages in memory (use database in production)
// let messages: any = [];
// const users = new Map(); // Store connected users
// const MAX_MESSAGES = 100; // Keep last 100 messages


// Health check endpoint
// app.get('/chat-health', (req, res) => {
//     res.json({
//         status: 'ok',
//         users: users.size,
//         messages: messages.length,
//     });
// });


// Socket.io connection
// io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);

//     const userId = socket.handshake.query.userId;
//     const username = socket.handshake.query.username;

//     // Handle user joining
//     socket.on('join', (data) => {
//         users.set(socket.id, {
//             userId: data.userId,
//             username: data.username,
//             socketId: socket.id,
//         });

//         console.log(`${data.username} joined the chat`);

//         // Send previous messages to the newly joined user
//         socket.emit('previousMessages', messages);

//         // Notify all users about the new user
//         socket.broadcast.emit('userJoined', {
//             userId: data.userId,
//             username: data.username,
//         });

//         // Send current user count
//         io.emit('userCount', users.size);
//     });

//     // Handle incoming messages
//     socket.on('sendMessage', (message) => {
//         console.log('Message received:', message);

//         // Add server timestamp
//         const messageWithTimestamp = {
//             ...message,
//             createdAt: new Date(),
//             _id: `${Date.now()}_${socket.id}`,
//         };

//         // Store message
//         messages.push(messageWithTimestamp);

//         // Keep only last MAX_MESSAGES
//         if (messages.length > MAX_MESSAGES) {
//             messages = messages.slice(-MAX_MESSAGES);
//         }

//         // Broadcast message to all clients
//         io.emit('message', messageWithTimestamp);
//     });

//     // Handle typing indicator
//     socket.on('typing', (data) => {
//         socket.broadcast.emit('userTyping', {
//             userId: data.userId,
//             username: data.username,
//         });
//     });

//     socket.on('stopTyping', (data) => {
//         socket.broadcast.emit('userStoppedTyping', {
//             userId: data.userId,
//             username: data.username,
//         });
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         const user = users.get(socket.id);
//         if (user) {
//             console.log(`${user.username} disconnected`);

//             // Notify all users about the disconnection
//             socket.broadcast.emit('userLeft', {
//                 userId: user.userId,
//                 username: user.username,
//             });

//             users.delete(socket.id);

//             // Send updated user count
//             io.emit('userCount', users.size);
//         }
//     });

//     // Handle errors
//     socket.on('error', (error) => {
//         console.error('Socket error:', error);
//     });
// });

// const PORT = 4000;
// chatServer.listen(PORT, () => {
//     console.log(`🚀 Chat server running on http://localhost:${PORT}`);
// });

export default app;