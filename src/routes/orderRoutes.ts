import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  updateOrder,
} from "../controllers/orders/OrdersController";
import { orderValidation } from "../validation/orderValidation";
import { validate } from "../middlewares/validationMiddleware";
import { authenticateJWT } from "../middlewares/authCheck";

export const orderRoutes = Router();
orderRoutes.use(authenticateJWT);

orderRoutes.get("/", getAllOrders);
orderRoutes.post("/", orderValidation, validate, createOrder);
orderRoutes.get("/:id", getOrderById);
orderRoutes.put("/update/:id", updateOrder);
orderRoutes.get("/me/:id", getOrderByUserId);
