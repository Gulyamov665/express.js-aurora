import { body, ValidationChain } from "express-validator";
import { checkAllowedFields, checkBodyFields } from "../utils/validationUtils";

const bodyAllowedFields = ["created_by", "lat", "long", "user_id", "restaurant", "products"];
const productAllowedFields = ["id", "price", "quantity", "name"];
//валидациа
export const orderValidation: ValidationChain[] = [
  body("*").custom((_, { req }) => checkBodyFields(req.body, bodyAllowedFields)),
  body("products").custom((products) => checkAllowedFields(products, productAllowedFields)),
  body("products.*.id").isInt({ min: 1 }).withMessage("ID продукта должен быть положительным числом"),
  body("products.*.price").isFloat({ min: 0 }).withMessage("Цена продукта должна быть положительным числом"),
  body("products.*.name").isString().withMessage("Отсутсвует поля name"),
  body("products.*.quantity").isInt({ min: 1 }).withMessage("Количество должно быть минимум 1"),

  body("user_id").isInt({ min: 1 }).withMessage("User id is required"),
  body("restaurant").isInt({ min: 1 }).withMessage("Restaurant is required"),
];
