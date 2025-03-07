import { Router } from "express";
import { createOrder, getAllOrders, getOrderById, getOrderByUserId } from "../controllers/orders/OrdersController";
import { orderValidation } from "../validation/orderValidation";
import { validate } from "../middlewares/validationMiddleware";

export const orderRoutes = Router();

orderRoutes.get("/", getAllOrders);
orderRoutes.post("/", orderValidation, validate, createOrder);
orderRoutes.get("/:id", getOrderById);
orderRoutes.get("/me/:id", getOrderByUserId);
