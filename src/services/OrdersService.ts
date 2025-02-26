import { AppDataSource } from "../database/data-source";
import { Orders } from "../entities/Orders";

const OrdersRepo = AppDataSource.getRepository(Orders);

export class OrderService {
  static async getAllOrders(): Promise<Orders[]> {
    return OrdersRepo.find();
  }

  static async createOrder(orderData: Partial<Orders>): Promise<Orders> {
    const newOrder = OrdersRepo.create(orderData);
    return OrdersRepo.save(newOrder);
  }

  static async findOrderById(id: number): Promise<Orders[]> {
    return await OrdersRepo.find({ where: { restaurant: id } });
  }
}
