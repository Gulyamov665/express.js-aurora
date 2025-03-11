import { AppDataSource } from "../config/database/data-source";
import { Orders } from "../entities/Orders";

interface PaginatedOrders {
  data: Orders[];
  total: number;
  page: number;
  last_page: number;
}
export class OrderService {
  static OrdersRepo = AppDataSource.getRepository(Orders);

  static async getAllOrders(page: number, limit: number): Promise<PaginatedOrders> {
    const [orders, total] = await this.OrdersRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    const response = {
      data: orders,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };

    return response;
  }

  static async createOrder(orderData: Partial<Orders>): Promise<Orders> {
    const newOrder = this.OrdersRepo.create(orderData);
    return this.OrdersRepo.save(newOrder);
  }

  static async findOrdersByVendorId(id: number): Promise<Orders[]> {
    return await this.OrdersRepo.find({ where: { restaurant: id } });
  }

  static async findOrderByUserId(id: number): Promise<Orders[]> {
    return await this.OrdersRepo.find({ where: { user_id: id } });
  }
}
