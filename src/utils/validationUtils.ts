import { Request } from "express";

/**
 * Проверяет, что в массиве объектов присутствуют только разрешённые поля.
 */
export const checkAllowedFields = (items: any[], allowedFields: string[]) => {
  if (!Array.isArray(items)) throw new Error("Ожидается массив данных");

  for (const item of items) {
    const extraKeys = Object.keys(item).filter((key) => !allowedFields.includes(key));
    if (extraKeys.length > 0) {
      throw new Error(`Недопустимые поля: ${extraKeys.join(", ")}`);
    }
  }
  return true;
};

/**
 * Проверяет, что в `req.body` нет лишних полей.
 */
export const checkBodyFields = (req: Request, allowedFields: string[]) => {
  const extraKeys = Object.keys(req).filter((key) => !allowedFields.includes(key));
  if (extraKeys.length > 0) {
    throw new Error(`Недопустимые поля в теле запроса: ${extraKeys.join(", ")}`);
  }
  return true;
};
