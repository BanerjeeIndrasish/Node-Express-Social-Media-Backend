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

export default app;
