import "reflect-metadata";
import express from "express";
import corsMiddleware from "./config/cors";
import routes from "./routes";
import { logging } from "./config/logger";

const app = express();

app.use(logging);

app.use(corsMiddleware);
app.use(express.json());
app.use(routes);

export default app;
