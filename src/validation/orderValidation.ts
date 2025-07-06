import { body, ValidationChain } from "express-validator";
import { checkAllowedFields, checkBodyFields } from "../utils/validationUtils";

const bodyAllowedFields = [
  "created_by",
  "lat",
  "long",
  "user_id",
  "restaurant",
  "products",
  "status",
  "orders_chat_id",
  "location",
  "user_phone_number",
  "cart_id",
];
const productAllowedFields = ["id", "price", "quantity", "name", "photo", "options"];

export const orderValidation: ValidationChain[] = [
  body("*").custom((_, { req }) => checkBodyFields(req.body, bodyAllowedFields)),
  body("products").custom((products) => checkAllowedFields(products, productAllowedFields)),
  body("products.*.id").isInt({ min: 1 }).withMessage("ID продукта должен быть положительным числом"),
  body("products.*.price").isFloat({ min: 0 }).withMessage("Цена продукта должна быть положительным числом"),
  body("products.*.name").isString().withMessage("Отсутсвует поля name"),
  body("products.*.quantity").isInt({ min: 1 }).withMessage("Количество должно быть минимум 1"),

  body("user_id").isInt({ min: 1 }).withMessage("User id is required"),

  body("restaurant")
    .isObject()
    .withMessage("Restaurant must be an object")
    .custom((restaurant) => {
      if (!restaurant.id || typeof restaurant.id !== "number" || restaurant.id < 1) {
        throw new Error("Restaurant ID must be a positive number");
      }
      if (!restaurant.name || typeof restaurant.name !== "string") {
        throw new Error("Restaurant name is required and must be a string");
      }
      if (!restaurant.photo || typeof restaurant.photo !== "string") {
        throw new Error("Restaurant photo is required and must be a string");
      }
      if (!restaurant.address || typeof restaurant.address !== "string") {
        throw new Error("Restaurant address is required and must be a string");
      }
      if (!restaurant.phone || typeof restaurant.phone !== "string") {
        throw new Error("Restaurant phone is required and must be a string");
      }
      return true;
    }),
];
