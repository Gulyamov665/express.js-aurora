import cors from "cors";

const corsMiddleware = cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://stage.aurora-app.uz",
    "https://aurora-3avt-git-feature-ts-gulyamov-mirzogulyams-projects.vercel.app/",
  ],

  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

export const WebSocketCors = {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://stage.aurora-app.uz",
      "https://aurora-3avt-git-feature-ts-gulyamov-mirzogulyams-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
};

export default corsMiddleware;
