import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../middleware/catchAsync";
import { authServices } from "./auth.service";

// register user
const registerUser = catchAsync(
    async(req:Request, res:Response, next:NextFunction)=>{

        const result = await authServices.registerUserIntoDB(req.body);

        res.status(httpStatus.OK).json({
            success: true,
            statusCode:httpStatus.OK, 
            message: "User Register successFully",
            body: result
        });

    }
);

export const authController = {
    registerUser
};