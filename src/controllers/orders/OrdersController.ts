import { Request, Response } from "express";
import { OrderService } from "../../services/OrdersService";
import { handleError } from "../../utils/handlerError";
import { calcTotalPrice } from "../../utils/countTotalPrice";
import { Orders } from "../../entities/Orders";
import { TypedRequest } from "./types";
import { io } from "../..";

export const getAllOrders = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 130;

  try {
    const orders = await OrderService.getAllOrders(page, limit);
    res.status(200).json(orders);
  } catch (error) {
    handleError(res, error, 500);
  }
};

export const createOrder = async (req: TypedRequest<Orders>, res: Response) => {
  try {
    const data = req.body;
    const totalPrice = calcTotalPrice(data.products);
    const dataWithTotalPrice = { ...data, total_price: totalPrice };

    const newOrder = await OrderService.createOrder(dataWithTotalPrice);
    io.emit("new_order", newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const orders = await OrderService.findOrdersByVendorId(id);
    res.status(200).json(orders);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const getOrderByUserId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const orders = await OrderService.findOrderByUserId(id);
    res.status(200).json(orders);
  } catch (error) {
    handleError(res, error, 400);
  }
};
