import { Router } from "express";
import { addToCart, decreaseItem, getCartItems, removeCart } from "../controllers/cart/CartController";
import { authenticateJWT } from "../middlewares/authCheck";

export const cartRoutes = Router();
cartRoutes.use(authenticateJWT);

cartRoutes.get("/cart", getCartItems);
cartRoutes.post("/cart/addToCart", addToCart);
cartRoutes.post("/cart/decrease", decreaseItem);
cartRoutes.delete("/cart/:cartId", removeCart);
