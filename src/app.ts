import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";

const app:Application = express();


// using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// root route
app.get("/", (re: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Welcome to Rent Nest",
    data: [],
  });
});



export default app;