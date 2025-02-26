import { Router } from "express";
import { createOrder, getAllOrders, getOrderById } from "../controllers/OrdersController";

export const orderRoutes = Router();

orderRoutes.get("/", getAllOrders);
orderRoutes.post("/", createOrder);
orderRoutes.get("/:id", getOrderById);
