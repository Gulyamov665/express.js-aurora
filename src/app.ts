import { connectDB } from "./database";
import express from "express";
import "reflect-metadata";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение роутов
app.use("/api", userRoutes);
app.use("/api/orders", orderRoutes);

// Подключение к базе
connectDB();

export default app;
