import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_KEY) {
  throw new Error("JWT_KEY is not defined in environment variables");
}

// const JWT_SECRET = String(process.env.JWT_KEY); // Нужно взять из Django settings.py
const JWT_SECRET = "django-insecure-pl+(h+sfdiotagz&rz&lo45w^qa)j0b=sbcfv&r1(&##n-44s%"; // Нужно взять из Django settings.py

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "доступ к запрашиваемой странице запрещен или у вас нет прав на просмотр контента" }); // Forbidden
      }

      req.user = user; // Добавляем user в request
      next();
    });
  } else {
    res.sendStatus(403); // Unauthorized
  }
};
