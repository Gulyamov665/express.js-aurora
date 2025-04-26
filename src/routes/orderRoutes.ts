import { Router } from "express";
import {
  createOrder,
  findOrderById,
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  getOrdersByStatus,
  ordersByDateRange,
  updateOrder,
} from "../controllers/orders/OrdersController";
import { orderValidation } from "../validation/orderValidation";
import { validate } from "../middlewares/validationMiddleware";
import { authenticateJWT } from "../middlewares/authCheck";

export const orderRoutes = Router();
// orderRoutes.use(authenticateJWT);

orderRoutes.get("/", authenticateJWT, getAllOrders);
orderRoutes.post("/", authenticateJWT, orderValidation, validate, createOrder);
orderRoutes.get("/status", authenticateJWT, getOrdersByStatus);
orderRoutes.get("/:id", authenticateJWT, getOrderById);
orderRoutes.put("/update/:id", updateOrder);
orderRoutes.get("/me/:id", authenticateJWT, getOrderByUserId);
orderRoutes.get("/getOrderById/:id", authenticateJWT, findOrderById);
orderRoutes.post("/ordersByDateRange", authenticateJWT, ordersByDateRange);

// Специфичные маршруты должны быть первыми
// orderRoutes.get("/status", authenticateJWT, getOrdersByStatus);
// orderRoutes.get("/me/:id", authenticateJWT, getOrderByUserId);
// // orderRoutes.get("/user/:id", authenticateJWT, getOrderByUserId);        // Переименован из /me/:id
// // orderRoutes.post("/date-range", authenticateJWT, ordersByDateRange);    // Использован kebab-case
// orderRoutes.post("/ordersByDateRange", authenticateJWT, ordersByDateRange);

// // CRUD операции
// orderRoutes.get("/", authenticateJWT, getAllOrders);
// orderRoutes.post("/", authenticateJWT, orderValidation, validate, createOrder);
// orderRoutes.get("/:id", authenticateJWT, getOrderById);
// orderRoutes.put("/:id", authenticateJWT, orderValidation, validate, updateOrder);
