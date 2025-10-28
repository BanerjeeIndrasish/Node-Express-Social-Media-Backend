import express from "express";
import corsMiddleware from "./middlewares/cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.route";
import { createServer } from "http";
import { setupSocket } from "./services/chat.service";
// import otpRoutes from "./routes/otp.router";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);


// Routes
// Health Check
app.get("/api/health", (_, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.use("/api/users", userRoutes);
app.use("/api", authRoutes)
// app.use("/api/otp", otpRoutes)

const chatServer = createServer(app);
const io = setupSocket(chatServer);

const PORT: any = process.env.PORT || 3001;
chatServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}....`);
    console.log(`Socket.IO server is ready for connections`);
});

export default app;