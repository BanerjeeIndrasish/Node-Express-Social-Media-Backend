import cors from "cors";

const corsOptions: cors.CorsOptions = {
  origin: "*", // allow all origins (or specify ["http://localhost:3000"])
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
