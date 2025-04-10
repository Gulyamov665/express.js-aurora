import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "../../entities/User";
import { Orders } from "../../entities/Orders";
import { Cart } from "../../entities/Cart";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Orders, Cart],
});
