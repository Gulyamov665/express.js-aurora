import { Router } from "express";
import { addToCart, decreaseItem, getCartItems, removeCart } from "../controllers/cart/CartController";

export const cartRoutes = Router();

cartRoutes.get("/cart", getCartItems);
cartRoutes.post("/cart/addToCart", addToCart);
cartRoutes.post("/cart/decrease", decreaseItem);
cartRoutes.delete("/cart/:cartId", removeCart);
