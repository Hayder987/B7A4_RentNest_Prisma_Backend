import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import AppError from "../Error/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let errorName = err?.name || "Error";
  let errorMessage = err?.message || "Internal Server Error";
  let error: unknown = err?.stack?.split("\n");

  // App Error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorName = err.name;
    errorMessage = err.message;
  }

  // Zod Error
  else if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorName = "ZodError";
    errorMessage = "Validation Error";

    error = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Prisma Validation Error
  else if (err?.name === "PrismaClientValidationError") {
    statusCode = httpStatus.BAD_REQUEST;
    errorName = err.name;
    errorMessage =
      "You have provided incorrect field type or missing required fields.";
  }

  // Prisma Known Request Error
  else if (err?.name === "PrismaClientKnownRequestError") {
    errorName = err.name;

    switch (err.code) {
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        errorMessage = "Duplicate value already exists.";
        break;

      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "Foreign key constraint failed.";
        break;

      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        errorMessage = "Requested resource not found.";
        break;

      default:
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = err.message;
        break;
    }
  }

  // Prisma Initialization Error
  else if (err?.name === "PrismaClientInitializationError") {
    errorName = err.name;

    switch (err.errorCode) {
      case "P1000":
        statusCode = httpStatus.UNAUTHORIZED;
        errorMessage =
          "Authentication failed against database server.";
        break;

      case "P1001":
        statusCode = httpStatus.SERVICE_UNAVAILABLE;
        errorMessage =
          "Can't reach database server.";
        break;

      default:
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = err.message;
        break;
    }
  }

  // Prisma Unknown Request Error
  else if (err?.name === "PrismaClientUnknownRequestError") {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorName = err.name;
    errorMessage = "Unknown database error occurred.";
  }

  // Normal JS Error
  else if (err instanceof Error) {
    errorName = err.name;
    errorMessage = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    name: errorName,
    message: errorMessage,
    error,
  });
};