import { Between, In, Raw } from "typeorm";
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
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Устанавливаем начало дня

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [orders, total] = await this.OrdersRepo.findAndCount({
      where: {
        restaurant: Raw((alias) => `${alias} @> '{"id": ${id}}'`), // Используем Raw для поиска в jsonb
        created_at: Between(startOfDay, endOfDay),
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

  static async findOrderByUserId(id: number): Promise<{ date: string; orders: Orders[] }[]> {
    const orders = await this.OrdersRepo.find({
      where: { user_id: id },
      order: { created_at: "DESC" },
    });

    const groupedMap: Record<string, Orders[]> = {};

    for (const order of orders) {
      const date = new Date(order.created_at).toISOString().split("T")[0]; // "2025-05-14"
      if (!groupedMap[date]) {
        groupedMap[date] = [];
      }
      groupedMap[date].push(order);
    }

    // Преобразуем в массив и сортируем по дате (сначала новые)
    const groupedArray = Object.entries(groupedMap)
      .map(([date, orders]) => ({ date, orders }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return groupedArray;
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
        status: In(["prepare", "on_the_way"]),
      },
      order: { created_at: "DESC" },
    });
  }

  static async getOrderById(id: number): Promise<Orders | null> {
    return await this.OrdersRepo.findOneBy({ id });
  }

  static async changeOrderItems(orderId: number, productId: number): Promise<Orders | null> {
    const order = await this.OrdersRepo.findOneBy({ id: orderId });
    if (!order) {
      return null;
    }
    const item = order.products.find((item) => item.id === productId);

    if (!item) {
      return null; // или можно выбросить ошибку, если продукт не найден
    }

    // Увеличиваем количество
    item.quantity += 1;

    order.total_price = order.products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return this.OrdersRepo.save(order);
  }
}
