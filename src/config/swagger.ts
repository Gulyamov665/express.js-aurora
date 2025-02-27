import swaggerJSDoc, { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Aurora API",
      version: "1.0.0",
      description: "Документация API для Aurora",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Локальный сервер",
      },
    ],
  },
  apis: ["../routes/orderRoutes.ts"], // Указываем пути к файлам с API
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
