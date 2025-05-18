export const orders = {
  "/api/orders": {
    get: {
      summary: "Получить все заказы",
      tags: ["Orders"],
      responses: {
        "200": {
          description: "Список заказов",
        },
      },
    },
  },
  "/api/orders/status": {
    get: {
      summary: "Получить заказы по статусу",
      tags: ["Orders"],
      parameters: [
        {
          in: "query",
          name: "status",
          required: true,
          schema: {
            type: "string",
          },
          description: "Статус заказа (например, new, prepare, canceled)",
        },
      ],
      responses: {
        "200": {
          description: "Список заказов по статусу",
        },
      },
    },
  },
};
