import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";

const app:Application = express();


// using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// using route middleware
app.use("/api/auth", authRoutes);


// root route
app.get("/", (re: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Welcome to Rent Nest",
    data: [],
  });
});


// use error handler middleware
app.use(globalErrorHandler);


export default app;