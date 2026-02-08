// In your chat.service.ts (Socket.IO setup file)
import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import OpenAI from "openai";

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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store in .env file
});

export const askGPT = async (req: any, res: any) => {
  try {
    const { message } = req.body;
    console.log('Message', message);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error, message: 'Failed to get response' });
  }
}