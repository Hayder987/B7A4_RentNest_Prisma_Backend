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

// update user status Ban/UnBan
const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.params.id;

    const result = await adminUserService.updateUserStatus(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: `${result?.name} Status ${result.status} SuccessFully`,
      data: result,
    });
  },
);

// get all properties
const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminUserService.getAllPropertiesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Properties retrieved successfully.",
    meta: result?.meta,
    data: result?.data,
  });
  },
);

export const adminUserController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
};
