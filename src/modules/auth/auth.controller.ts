import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

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
    const {accessToken, refreshToken, user} = await authServices.loginUserIntoDB(req.body);

      // set token on cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 15,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Login successfully!",
      data: {
        accessToken,
        refreshToken,
        user,
      },
    });
  },
);

// get personal user
const getUserMe = catchAsync(
   async (req: Request, res: Response, next: NextFunction) =>{

    const { id } = req.user as JwtPayload;

    const user = await authServices.getUserMeFromDB(id as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your Profile Retrieve successfully!",
      data: {user}
    });

   } 
);


export const authController = {
  registerUser,
  loginUser,
  getUserMe
};
