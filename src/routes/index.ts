import { Router } from "express";
import userRoutes from "./userRoutes";
import { orderRoutes } from "./orderRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger";

const routes = Router();

routes.use("/api", userRoutes);
routes.use("/api/orders", orderRoutes);

routes.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default routes;
