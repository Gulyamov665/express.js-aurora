import { connectDB } from "./database";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import { orderRoutes } from "./routes/orderRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/orders", orderRoutes);

connectDB();

export default app;
