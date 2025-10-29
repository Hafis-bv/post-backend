import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { JwtPayload } from "../types/auth";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new AppError("Not authorized, no token found", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { userId } = decoded as JwtPayload;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return next(new AppError("Server error", 500));
  }
};
