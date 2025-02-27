import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

if (!process.env.JWT_KEY) {
  throw new Error("JWT_KEY is not defined in environment variables");
}

const JWT_SECRET = process.env.JWT_KEY; // Нужно взять из Django settings.py

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user; // Добавляем user в request
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};
