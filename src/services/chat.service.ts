// In your chat.service.ts (Socket.IO setup file)
import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

export const setupSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      // Allow connections from any origin (for testing)
      origin: "*",
      methods: ["GET", "POST", 'PUT', 'DELETE'],
      credentials: false
    },
    transports: ['websocket', 'polling'],
    // Add these options for better network compatibility
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id, 'from:', socket.handshake.address);

    socket.on('send_message', (message: string) => {
      console.log('Message received:', message);
      const response = {
        message,
        senderId: socket.id,
        timestamp: new Date().toISOString()
      };
      io.emit('receive_message', response);
    });

    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', socket.id, 'reason:', reason);
    });

    // Add error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Log when Socket.IO server starts
  io.on('connection', (socket) => {
    console.log(`Socket.IO connection established: ${socket.id}`);
  });

  return io;
};