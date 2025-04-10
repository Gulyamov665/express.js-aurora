import { Router } from "express";
import { addToCart, decreaseItem, getCartItems } from "../controllers/cart/CartController";

export const cartRoutes = Router();

cartRoutes.get("/cart", getCartItems);
cartRoutes.post("/cart/addToCart", addToCart);
cartRoutes.post("/cart/decrease", decreaseItem);
