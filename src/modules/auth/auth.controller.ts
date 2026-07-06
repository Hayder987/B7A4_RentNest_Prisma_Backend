import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

// register user
const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authServices.registerUserIntoDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  },
);

// login user 
const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await authServices.loginUserIntoDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Login successfully!",
      data: {result},
    });
  },
);

export const authController = {
  registerUser,
  loginUser
};
