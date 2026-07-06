
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../Error/AppError";


export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error:", err);

  let statusCode : number = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = "Internal Server Error";
  let errorName = err.name || "Error";

  // Custom App Error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
    errorName = err.name;
  }

  // Normal JS Error
  else if (err instanceof Error) {
    errorMessage = err.message;
    errorName = err.name;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    name: errorName,
    message: errorMessage,
    error: err.stack?.split("\n")
  });
};