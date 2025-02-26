import { Response } from "express";

export const handleError = (res: Response, error: unknown, statusCode = 400) => {
  const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
  res.status(statusCode).json({ message: errorMessage });
};
