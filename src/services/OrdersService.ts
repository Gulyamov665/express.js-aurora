import { AppDataSource } from "../database/data-source";
import { Orders } from "../entities/Orders";

export class OrderService {
  static OrdersRepo = AppDataSource.getRepository(Orders);

  static async getAllOrders(): Promise<Orders[]> {
    return this.OrdersRepo.find();
  }

  static async createOrder(orderData: Partial<Orders>): Promise<Orders> {
    const newOrder = this.OrdersRepo.create(orderData);
    return this.OrdersRepo.save(newOrder);
  }

  static async findOrderById(id: number): Promise<Orders[]> {
    return await this.OrdersRepo.find({ where: { restaurant: id } });
  }

  static async findOrderByUserId(id: number): Promise<Orders[]> {
    return await this.OrdersRepo.find({ where: { user_id: id } });
  }
}
