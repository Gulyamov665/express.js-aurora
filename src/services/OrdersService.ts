import { Between, Raw } from "typeorm";
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

  static async findOrdersByVendorId(id: number, page: number, limit: number): Promise<PaginatedOrders> {
    const [orders, total] = await this.OrdersRepo.findAndCount({
      where: {
        restaurant: Raw((alias) => `${alias} @> '{"id": ${id}}'`), // Используем Raw для поиска в jsonb
      },

      order: { created_at: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: orders,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };
  }

  static async getOrderByStatus(status: string): Promise<Orders[]> {
    const order = await this.OrdersRepo.find({
      where: { status },
      order: { created_at: "DESC" },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  static async findOrderByUserId(id: number): Promise<Orders[]> {
    return await this.OrdersRepo.find({ where: { user_id: id } });
  }

  static async updateOrder(id: number, updateData: Partial<Orders>): Promise<Orders | null> {
    const order = await this.OrdersRepo.findOneBy({ id });
    if (!order) {
      return null;
    }
    Object.assign(order, updateData);
    return this.OrdersRepo.save(order);
  }

  static async findOrderById(id: number): Promise<Orders | null> {
    return await this.OrdersRepo.findOneBy({ id });
  }

  static async getOrdersByDateRange(startDateStr: string, endDateStr: string, restaurantId: number): Promise<Orders[]> {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const orders = await this.OrdersRepo.find({
      where: {
        created_at: Between(startDate, endDate),
        restaurant: Raw((alias) => `${alias} @> '{"id": ${restaurantId}}'`),
      },
      order: { created_at: "DESC" },
    });

    return orders;
  }

  static async findOrdersByCourierId(courierId: number): Promise<Orders[]> {
    return this.OrdersRepo.find({
      where: {
        courier: Raw((alias) => `${alias} @> '{"id": ${courierId}}'`),
      },
      order: { created_at: "DESC" },
    });
  }

  static async getOrderById(id: number): Promise<Orders | null> {
    return await this.OrdersRepo.findOneBy({ id });
  }
}
