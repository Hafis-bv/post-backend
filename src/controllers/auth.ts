import { NextFunction, Request, Response } from "express";
import { JwtPayload, RegisterRequestBody } from "../types/auth";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req.body as RegisterRequestBody;

  if (!name || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  if (password.length < 5) {
    return next(
      new AppError("Password must contain at least 5 characters", 400)
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateTokenAndSetCookies(res, user.id);

    res.status(201).json({
      message: "You have successfully registered!",
      token,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("Server error", 500));
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body as RegisterRequestBody;
  if (!email || !password) {
    return next(new AppError("All fields are required", 400));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Invalid password", 400));
    }
    const token = generateTokenAndSetCookies(res, user.id);

    res.status(200).json({ message: "Login successful", token });
  } catch (e) {
    console.log(e);
    return next(new AppError("Server error", 500));
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  const { token } = req.cookies;
  if (!token) {
    return next(new AppError("Invalid or expired token", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const { userId } = decoded as JwtPayload;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return next(new AppError("Server error", 500));
  }
}
