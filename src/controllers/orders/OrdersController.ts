import { Request, Response } from "express";
import { OrderService } from "../../services/OrdersService";
import { handleError } from "../../utils/handlerError";
import { calcTotalPrice, Product, totalSum } from "../../utils/countTotalPrice";
import { Orders } from "../../entities/Orders";
import { TypedRequest } from "./types";
import { io } from "../..";
import { CartService } from "../../services/CartService";
import axios from "axios";
import { sendPushToCourier } from "../../config/firebase/sendPushHandler";

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
      const userResponse = await axios.get(`https://new.aurora-api.uz/api/v1/auth/user/${data.created_by}`);
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

const notifyAboutNewOrder = async (order: Orders) => {
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
    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    io.emit("update_order", updatedOrder);
    if (updatedOrder.status === "prepare") {
      sendPushToCourier(
        "dgu1vaFUQ2KjELkLZAJNr3:APA91bEbDyWQc-xpYB_A_jqH4tdZWQYGrm1vO_we3RPfkbqcYzIN0CjYUkyYlLAxBF1N0UmE5-tKoLT78BMvSdzn1lFpLtSD9pT8FHyATHhibcawsmQlbbk",
        updatedOrder.id
      );
      notifyAboutOrderStatusChange(updatedOrder);
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    handleError(res, error, 400);
  }
};
const notifyAboutOrderStatusChange = async (order: Orders) => {
  try {
    const data = {
      id: order.id,
      orders_chat_id: order.orders_chat_id,
      courier: {
        first_name: "John",
        last_name: "Doe",
      },
    };
    await axios.post("https://notify.aurora-api.uz/fastapi/accept-order", data);
  } catch (error) {
    console.error("Ошибка при отправке уведомления:", error);
  }
};

export const findOrderById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const order = await OrderService.findOrderById(id);
    res.status(200).json(order);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const ordersByDateRange = async (req: Request, res: Response) => {
  const { startDate, endDate, restaurantId } = req.body;

  if (!restaurantId) {
    res.status(400).json({ message: "restaurantId is required" });
    return;
  }

  try {
    const orders = await OrderService.getOrdersByDateRange(startDate, endDate, restaurantId);
    const sum = totalSum(orders);
    const canceled = orders.filter((order) => order.status === "canceled").length;

    res.status(200).json({ orders, sum, quantity: orders.length, canceled });
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const getOrdersByStatus = async (req: Request, res: Response) => {
  const status = req.query.status as string;
  if (!status) {
    res.status(400).json({ message: "Status is required" });
    return;
  }
  try {
    const orders = await OrderService.getOrderByStatus(status);
    res.status(200).json(orders);
  } catch (error) {
    handleError(res, error, 400);
  }
};
