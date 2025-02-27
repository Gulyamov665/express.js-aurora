import { Router } from "express";
import { createOrder, getAllOrders, getOrderById, getOrderByUserId } from "../controllers/OrdersController";

export const orderRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API для управления заказами
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Получить список заказов
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Список заказов
 */

orderRoutes.get("/", getAllOrders);
orderRoutes.post("/", createOrder);
orderRoutes.get("/:id", getOrderById);
orderRoutes.get("/me/:id", getOrderByUserId);
