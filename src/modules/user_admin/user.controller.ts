import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminUserService } from "./user.service";

// get all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminUserService.getAllUsersFromDB(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All User Retrieve successfully.",
      data: result?.data,
      meta: result?.meta,
    });
  },
);

export const adminUserController = {
  getAllUsers,
};
