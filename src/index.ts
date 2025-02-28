import app from "./app";
import { connectDB } from "./config/database";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  if (process.env.NODE_ENV !== "test") {
    await connectDB(); // Подключаем базу, только если это НЕ тесты
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
