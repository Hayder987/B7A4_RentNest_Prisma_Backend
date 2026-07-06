import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryServices } from "./category.service";

// create category
const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await categoryServices.createCategoryInDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category Create successfully!",
      data: { category },
    });
  },
);

// get all category
const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoryServices.getAllCategoryFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category Retrieve successfully!",
      data: categories?.categories,
      meta: {
        total: categories.totalCategory,
      },
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategory,
};
