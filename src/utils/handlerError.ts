import { Response } from "express";

export const handleError = (res: Response, error: unknown, statusCode = 400) => {
  const errorMessage = error instanceof Error ? error.message : "Ошибка сервера";
  res.status(statusCode).json({ message: errorMessage });
};
