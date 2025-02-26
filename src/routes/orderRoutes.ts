import { Router } from "express";
import { createOrder, getAllOrders, getOrderById } from "../controllers/OrdersController";

const router = Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/:id", getOrderById);

export default router;
