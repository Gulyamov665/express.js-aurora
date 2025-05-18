import { Request, Response } from "express";
import { OrderService } from "../../services/OrdersService";
import { handleError } from "../../utils/handlerError";
import { calcTotalPrice, Product, totalSum } from "../../utils/countTotalPrice";
import { Orders } from "../../entities/Orders";
import { TypedRequest } from "./types";
import { io } from "../..";
import { sendPushToCourier } from "../../config/firebase/sendPushHandler";
import { CartService } from "../../services/CartService";
import { getChannel, getDistance, getUserInfo, notifyAboutNewOrder, notifyAboutOrderStatusChange } from "../../api/api";

export interface CreateOrderDTO {
  created_by: number;
  products: Product[];
  cart_id: number;
  restaurant: number;
}

const tempTokens = [
  "ck0pwmrnQc201jsXERlBat:APA91bHvWHGoJt79Cs3FvKODyTl1pPlIxK9Um5FkubTYXtaSj-bgwf3-4INQVtzmv8_cv4ZtrMmlr2TLjUw9CPBAiaFvUKI2Xo9KFvC4el059ZK9ZP5DkG4",
  "cavNv-27Tb6J400zZZR_CN:APA91bEPi5hoSf4wHgJWh7fYDDiQnfl3fBxZVZKkTls3Mf05FbASChY13ZsEg8DNiXaJECryYGcxAO4UddYB1wqKe0I7sRADZ7u3dJJI4JkmLf4Hl7UtfTE",
];

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
    const { fullName: createdByFullName, location } = await getUserInfo(Number(data?.created_by));

    const totalPrice = calcTotalPrice(data.products);
    const orderData = {
      ...data,
      total_price: totalPrice,
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
      if (tokens) {
        console.log(tokens[0]?.channels);
        tokens[0]?.channels.forEach((token) => sendPushToCourier(token.fcm_token, id));
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

export const getOrderByCourierId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const orders = await OrderService.findOrdersByCourierId(id);
    res.status(200).json(orders);
  } catch (error) {
    handleError(res, error, 400);
  }
};
