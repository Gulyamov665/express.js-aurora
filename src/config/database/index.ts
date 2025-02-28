import { AppDataSource } from "./data-source";

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("📦 Database connected!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1); // Завершаем процесс при критической ошибке
  }
};
