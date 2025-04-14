import { Request, Response } from "express";
import { OrderService } from "../../services/OrdersService";
import { handleError } from "../../utils/handlerError";
import { calcTotalPrice, Product } from "../../utils/countTotalPrice";
import { Orders } from "../../entities/Orders";
import { TypedRequest } from "./types";
import { io } from "../..";
import { CartService } from "../../services/CartService";
import axios from "axios";
import { body } from "express-validator";

export interface CreateOrderDTO {
  created_by: number;
  products: Product[];
  cart_id: number;
  restaurant: number;
}

export const getAllOrders = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 130;
  const id = Number(req.query?.id);

  try {
    if (id) {
      const orders = await OrderService.findOrdersByVendorId(id, 1, 10);
      res.status(200).json(orders);
    } else {
      const orders = await OrderService.getAllOrders(page, limit);
      res.status(200).json(orders);
    }
  } catch (error) {
    handleError(res, error, 500);
  }
};

export const createOrder = async (req: TypedRequest<Orders>, res: Response) => {
  try {
    const data = req.body;
    let createdByFullName = "Unknown";
    try {
      const userResponse = await axios.get(`https://aurora-api.uz/api/v1/auth/user/${data.created_by}`);
      const user = userResponse.data;
      createdByFullName = `${user.first_name} ${user.last_name}`;
    } catch (axiosError) {
      console.error("❌ Ошибка при получении пользователя:", axiosError);
    }

    const totalPrice = calcTotalPrice(data.products);
    const orderData = {
      ...data,
      total_price: totalPrice,
      created_by: createdByFullName,
    };

    const newOrder = await OrderService.createOrder(orderData);
    io.emit("new_order", newOrder);
    notifyAboutNewOrder(newOrder);

    if (res.statusCode === 200) {
      const cartDeleted = await CartService.removeCartByUserAndRestaurant({
        user_id: data.user_id,
        restaurant: data.restaurant.id,
      }); // Удаляем корзину по cart_id

      if (!cartDeleted) {
        console.warn(`Корзина с ID ${data} не найдена или не была удалена.`);
      }
    }

    res.status(201).json(newOrder);
  } catch (error) {
    return handleError(res, error, 400);
  }
};

const notifyAboutNewOrder = async (order: any) => {
  try {
    await axios.post("https://notify.aurora-api.uz/fastapi/new-order", order);
  } catch (error) {
    console.error("Ошибка при отправке уведомления:", error);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string);
  const id = Number(req.params.id);
  try {
    const orders = await OrderService.findOrdersByVendorId(id, page, limit);
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

export const updateOrder = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updateData = req.body;

  try {
    const updatedOrder = await OrderService.updateOrder(id, updateData);
    io.emit("update_order", updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    handleError(res, error, 400);
  }
};
