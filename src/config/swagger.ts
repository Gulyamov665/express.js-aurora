import swaggerJSDoc, { Options } from "swagger-jsdoc";
import { orders } from "../docs/docs";

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
    paths: orders,
  },
  apis: [__dirname + "/../routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
