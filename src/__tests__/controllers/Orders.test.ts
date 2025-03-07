import request from "supertest";
import app from "../../app";
import { OrderService } from "../../services/OrdersService";

jest.mock("../../services/OrdersService"); // Мокаем OrderService

describe("POST /api/orders", () => {
  const mockOrderData = {
    products: [{ id: 1, name: "Burger", price: 5 }],
    total_price: 5,
    lat: "40.7128",
    long: "-74.0060",
    user_id: 1,
    restaurant: 2,
  };

  const mockOrder = {
    id: 3,
    products: [{ id: 1, name: "Burger", price: 5 }],
    total_price: 5,
    lat: "40.7128",
    long: "-74.0060",
    user_id: 1,
    restaurant: 2,
  };

  const mockOrderDataAll = [
    {
      products: [{ id: 1, name: "Burger", price: 5 }],
      total_price: 5,
      lat: "40.7128",
      long: "-74.0060",
      user_id: 1,
      restaurant: 2,
    },
    {
      products: [{ id: 1, name: "Burger", price: 5 }],
      total_price: 5,
      lat: "40.7128",
      long: "-74.0060",
      user_id: 1,
      restaurant: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Должен вернуть заказ по ID со статусом 200", async () => {
    (OrderService.findOrdersByVendorId as jest.Mock).mockResolvedValue(mockOrderDataAll);

    const response = await request(app).get("/api/orders/4");
    console.log(response.body.id);
    expect(response.statusCode).toBe(200); // Ожидаем статус 200
    expect(response.body).toEqual(mockOrderDataAll); // Должны получить объект заказа
    // expect(OrderService.findOrderById).toHaveBeenCalledWith(1); // Убедимся, что метод был вызван с 1
  });

  it("GetAllOrders Должен вернуть массив из заказов и статус 200", async () => {
    (OrderService.getAllOrders as jest.Mock).mockResolvedValue(mockOrderDataAll);
    const response = await request(app).get("/api/orders");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockOrderDataAll);
  });

  it("CreateOrders должен успешно создавать заказ и возвращать 201 статус", async () => {
    (OrderService.createOrder as jest.Mock).mockResolvedValue(mockOrderData);

    const response = await request(app).post("/api/orders").send(mockOrderData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockOrderData);
    expect(OrderService.createOrder).toHaveBeenCalledWith(mockOrderData);
  });

  it("должен возвращать 400 статус при ошибке в OrderService", async () => {
    (OrderService.createOrder as jest.Mock).mockRejectedValue(new Error("Ошибка"));

    const response = await request(app).post("/api/orders").send(mockOrderData);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: "Ошибка" });
  });
});
