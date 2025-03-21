import cors from "cors";

const corsMiddleware = cors({
  // origin: ["http://localhost:3000", "http://localhost:5173", "https://stage.aurora-app.uz"],
  origin: ["*"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

export const WebSocketCors = {
  cors: {
    // origin: "http://localhost:5173", // Укажи URL фронта (или "*", если тестируешь локально)
    origin: ["*"], // Укажи URL фронта (или "*", если тестируешь локально)
    methods: ["GET", "POST"],
  },
};

export default corsMiddleware;
