import { Request, Response } from "express";
import { OrderService } from "../services/OrdersService";
import { handleError } from "../utils/handlerError";

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    handleError(res, error, 500);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const newOrder = await OrderService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const orders = await OrderService.findOrderById(id);
    res.status(200).json(orders);
  } catch (error) {
    handleError(res, error, 400);
  }
};


