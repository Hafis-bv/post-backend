import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
