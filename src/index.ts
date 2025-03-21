import app from "./app";
import { WebSocketCors } from "./config/cors";
import { connectDB } from "./config/database";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
export const io = new Server(server, WebSocketCors);

const startServer = async () => {
  if (process.env.NODE_ENV !== "test") {
    await connectDB(); // Подключаем базу, только если это НЕ тесты
  }

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  io.on("connection", (socket) => {
    console.log(`🛜 WS Клиент подключен: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`🔌 Клиент отключился: ${socket.id}`);
    });
  });
};

startServer();
