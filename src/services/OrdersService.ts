import { Between, In, Raw } from "typeorm";
import { AppDataSource } from "../config/database/data-source";
import { Orders } from "../entities/Orders";
import { getProductById } from "../api/api";
import { ChangeOrderItemsParams } from "./orderTypes";

interface PaginatedOrders {
  data: Orders[];
  total: number;
  page: number;
  last_page: number;
}
const SERVICE_FEE = 3500;

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
    const now = new Date();

    // Если дата передана — выставляем время на начало/конец дня
    let startDate: Date;
    let endDate: Date;

    if (startDateStr) {
      startDate = new Date(startDateStr);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
    }

    if (endDateStr) {
      endDate = new Date(endDateStr);
      endDate.setHours(23, 59, 59, 999);
    } else {
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
    }

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

  static async getCourierOrderStats(
    courierId: number,
    period?: "today" | "week" | "month" | "period"
  ): Promise<Orders[]> {
    const now = new Date();

    const start = new Date();
    const end = new Date();

    switch (period) {
      case "week":
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start.setMonth(now.getMonth() - 1);
        break;
      case "today":
      default:
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    // if (period !== "today") {
    //   start.setHours(0, 0, 0, 0);
    //   end.setTime(now.getTime()); // до текущего момента
    // }
    if (period) {
      return this.OrdersRepo.find({
        where: {
          created_at: Between(start, end),
          courier: Raw((alias) => `${alias} @> '{"id": ${courierId}}'`),
          status: In(["completed", "on_the_way", "prepare"]),
        },
        order: { created_at: "DESC" },
      });
    }

    return this.OrdersRepo.find({
      where: {
        // created_at: Between(start, end),
        courier: Raw((alias) => `${alias} @> '{"id": ${courierId}}'`),
        status: In(["prepare", "on_the_way"]),
      },
      order: { created_at: "DESC" },
    });
  }
  static async getOrderById(id: number): Promise<Orders | null> {
    return await this.OrdersRepo.findOneBy({ id });
  }

  static async changeOrderItems(args: ChangeOrderItemsParams): Promise<Orders | null> {
    const { id, product_id, type, option_id = null } = args;

    const order = await this.OrdersRepo.findOne({ where: { id } });
    if (!order) return null;

    const item = order.products.find((item) => {
      const sameId = item.id === product_id;
      const sameOption = option_id ? item.options?.id === option_id : !item.options;
      return sameId && sameOption;
    });

    if (type === "add") {
      if (item?.quantity) {
        item.quantity += 1;
      } else {
        const product = await getProductById(product_id);

        if (product) {
          let selectedOption = null;

          if (option_id && Array.isArray(product.options.variants)) {
            selectedOption = product.options.variants.find((opt) => opt.id === option_id);
          }

          const newProduct = {
            id: product.id,
            name: product.name,
            photo: product.photo,
            price: product.price,
            quantity: 1,
            options: selectedOption
              ? {
                  id: selectedOption.id,
                  name: selectedOption.name,
                  price: selectedOption.price,
                  is_active: selectedOption.is_active,
                }
              : undefined,
          };

          order.products.push(newProduct);
        }
      }
    }

    if (type === "decrease" && item?.quantity) {
      item.quantity -= 1;
    }

    if (item && type === "increase") {
      item.quantity += 1;
    }

    if (item?.quantity === 0) {
      order.products = order.products.filter((product) => {
        const sameId = product.id === product_id;
        const sameOption = option_id ? product.options?.id === option_id : !product.options;
        return !(sameId && sameOption);
      });
    }

    order.total_price =
      order.products.reduce((sum, p) => sum + (p.options?.price ?? p.price) * p.quantity, 0) + SERVICE_FEE;

    return this.OrdersRepo.save(order);
  }
}
