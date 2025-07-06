import { Request, Response } from "express";
import { OrderService } from "../../services/OrdersService";
import { handleError } from "../../utils/handlerError";
import { calcTotalPrice, totalSum, totalSumFee } from "../../utils/countTotalPrice";
import { Orders } from "../../entities/Orders";
import { TypedRequest } from "./types";
import { io } from "../..";
import { sendPushToCouriers } from "../../config/firebase/sendPushHandler";
import { CartService } from "../../services/CartService";
import { getChannel, getCourierInfo, getDistance } from "../../api/api";
import { getUserInfo, notifyAboutNewOrder, notifyAboutOrderStatusChange } from "../../api/api";
import { ChangeOrderItemsParams } from "../../services/orderTypes";
import { Product } from "../../services/cartTypes";

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
  const fee = 3500;
  try {
    const data = req.body;
    const cart_data = await CartService.getCartById(40);

    // console.log(cart_data);
    // if (!cart_data) return;

    const { fullName: createdByFullName, location } = await getUserInfo(Number(data?.created_by));

    const totalPrice = calcTotalPrice(data.products);
    const orderData = {
      ...data,
      total_price: totalPrice && totalPrice + fee,
      created_by: createdByFullName,
      location,
    };

    const newOrder = await OrderService.createOrder(orderData);

    io.emit("new_order", newOrder);
    notifyAboutNewOrder(newOrder);

    if (res.statusCode === 200) {
      const cartDeleted = await CartService.removeCartByUserAndRestaurant({
        user_id: data.user_id,
        restaurant: data.restaurant.id,
      });

      // Удаляем корзину по cart_id
      if (!cartDeleted) {
        console.warn(`Корзина с ID ${data} не найдена или не была удалена.`);
      }
    }
    res.status(201).json(newOrder);
  } catch (error) {
    return handleError(res, error, 400);
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
  const order = await OrderService.getOrderById(id);

  const destination = await getDistance(
    Number(order?.restaurant.lat),
    Number(order?.restaurant.long),
    Number(order?.location.lat),
    Number(order?.location.long)
  );

  const data = { ...updateData, destination };

  try {
    const updatedOrder = await OrderService.updateOrder(id, data);
    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    io.emit("update_order", updatedOrder);

    if (updatedOrder.status === "awaiting_courier") {
      const tokens = await getChannel(updatedOrder.restaurant.id);
      if (tokens?.channels?.length) {
        const fcmTokens = tokens.channels.map((token) => token.fcm_token);
        await sendPushToCouriers(fcmTokens, id);
      }
    }
    if (updatedOrder.status === "prepare") {
      updatedOrder.courier.accepted_at = new Date();
      notifyAboutOrderStatusChange(updatedOrder);
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    handleError(res, error);
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
    const delivered = orders.filter((order) => order.status === "completed");
    const serviceFee = totalSumFee(delivered);

    res
      .status(200)
      .json({ orders, sum, quantity: orders.length, canceled, delivered: delivered.length, fee_sum: serviceFee });
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const getOrdersByStatus = async (req: Request, res: Response) => {
  const status = req.query.status as string;
  const id = req.query.id as string;

  if (!status && !id) {
    res.status(400).json({ message: "Status is required" });
    return;
  }

  const courierChannel = await getCourierInfo(id);

  try {
    const orders = await OrderService.getOrderByStatus(status);

    const filteredOrders = orders.filter(
      (order) => order.restaurant && courierChannel?.channels.includes(order.restaurant.id)
    );

    res.status(200).json(filteredOrders);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const getOrderByCourierId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const orders = await OrderService.findOrdersByCourierId(id);
    res.status(200).json(orders);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const getCourierStats = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const period = req.query.period as "today" | "week" | "month" | "period";

  try {
    const orders = await OrderService.getCourierOrderStats(id, period);

    const stats = {
      today: {
        deliveries: orders.filter((order) => order.status === "completed").length,
        earnings: 0,
        time: "0ч 0м",
        goal: orders.length, // цель по заказам
        yesterdayDeliveries: 10,
        yesterdayEarnings: 27000,
      },
      total: {
        deliveries: orders.length,
        earnings: 525000,
        avgTime: "38 мин",
      },
    };

    res.status(200).json({ orders, stats });
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const changeOrderComposition = async (req: Request, res: Response) => {
  const { id, product_id, type, option_id }: ChangeOrderItemsParams = req.body;

  try {
    const changeItems = OrderService.changeOrderItems({ id, product_id, type, option_id });
    res.status(201).json(changeItems);
  } catch (error) {
    handleError(res, error, 400);
  }
};
