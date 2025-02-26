import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { handleError } from "../utils/handlerError";

// Получение всех пользователей
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    handleError(res, error, 500);
  }
};

// Получение одного пользователя
export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const user = await UserService.getUser(id);
    res.status(200).json(user);
  } catch (error) {
    handleError(res, req, 400);
  }
};

// Создание нового пользователя
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await UserService.createUser(name, email, password);
    res.status(201).json(newUser);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password } = req.body;
    const updateUser = await UserService.updateUser(id, name, email, password);
    res.status(204).json(updateUser);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleteUser = await UserService.deleteUser(id);
    res.status(201).json(deleteUser);
  } catch (error) {
    handleError(res, error, 400);
  }
};
