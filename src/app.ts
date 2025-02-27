import { connectDB } from "./database";
import "reflect-metadata";
import express from "express";
import corsMiddleware from "./config/cors";
import routes from "./routes";

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use(routes);

connectDB();

export default app;
