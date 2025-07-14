import { Router } from "express";
import { changeOrderComposition, createOrder } from "../controllers/orders/OrdersController";
import { findOrderById, getAllOrders, getCourierStats } from "../controllers/orders/OrdersController";
import { getOrdersByStatus, ordersByDateRange, updateOrder } from "../controllers/orders/OrdersController";
import { getOrderByCourierId, getOrderById, getOrderByUserId } from "../controllers/orders/OrdersController";
import { orderValidation } from "../validation/orderValidation";
import { validate } from "../middlewares/validationMiddleware";
import { authenticateJWT } from "../middlewares/authCheck";

export const orderRoutes = Router();
// orderRoutes.use(authenticateJWT);

orderRoutes.get("/", getAllOrders);
orderRoutes.post("/", orderValidation, authenticateJWT, validate, createOrder);
orderRoutes.get("/status", getOrdersByStatus);
orderRoutes.get("/:id", getOrderById);
orderRoutes.put("/update/:id", updateOrder);
orderRoutes.get("/me/:id", getOrderByUserId);
orderRoutes.get("/getOrderById/:id", findOrderById);
orderRoutes.post("/ordersByDateRange", ordersByDateRange);
orderRoutes.get("/getCourierOrders/:id", getOrderByCourierId);
orderRoutes.get("/getCourierStats/:id", getCourierStats);
orderRoutes.post("/changeOrderComposition", changeOrderComposition);
