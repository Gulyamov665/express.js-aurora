import cors from "cors";

const corsMiddleware = cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "https://stage.aurora-app.uz"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

export default corsMiddleware;
