import "reflect-metadata";
import express from "express";
import corsMiddleware from "./config/cors";
import routes from "./routes";
import { logging } from "./config/logger";
import swaggerSpec from "./config/swagger";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(logging);

app.use(corsMiddleware);
app.use(express.json());
app.use(routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
