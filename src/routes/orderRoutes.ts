import { Router } from "express";
import {
  changeOrderComposition,
  createOrder,
  findOrderById,
  getAllOrders,
  getOrderByCourierId,
  getOrderById,
  getOrderByUserId,
  getOrdersByStatus,
  ordersByDateRange,
  updateOrder,
} from "../controllers/orders/OrdersController";
import { orderValidation } from "../validation/orderValidation";
import { validate } from "../middlewares/validationMiddleware";
// import { authenticateJWT } from "../middlewares/authCheck";

export const orderRoutes = Router();
// orderRoutes.use(authenticateJWT);

orderRoutes.get("/", getAllOrders);
orderRoutes.post("/", orderValidation, validate, createOrder);
orderRoutes.get("/status", getOrdersByStatus);
orderRoutes.get("/:id", getOrderById);
orderRoutes.put("/update/:id", updateOrder);
orderRoutes.get("/me/:id", getOrderByUserId);
orderRoutes.get("/getOrderById/:id", findOrderById);
orderRoutes.post("/ordersByDateRange", ordersByDateRange);
orderRoutes.get("/getCourierOrders/:id", getOrderByCourierId);
orderRoutes.post("/changeOrderComposition", changeOrderComposition);
