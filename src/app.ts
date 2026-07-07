import { paymentRoutes } from './modules/payment/payment.route';
import express, { Application, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import config from "./config";
import { notFound } from "./middleware/notFound";
import { categoryRoutes } from "./modules/category/category.route";
import { propertiesRoutes } from "./modules/property/property.route";
import { rentalRequestRoutes } from "./modules/rentalRequest/rentalRequest.route";
import { landlordRoutes } from "./modules/rentalRequest/landlord.rental.route";


const app:Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);


app.use("/api/payments/webhook", express.raw({ type: 'application/json' }))


// using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// using route middleware
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/rentals", rentalRequestRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/payments", paymentRoutes);

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
app.use(notFound);
app.use(globalErrorHandler);


export default app;