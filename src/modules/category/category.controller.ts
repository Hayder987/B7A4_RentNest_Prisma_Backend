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

// update category by admin
const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id
    const result = await categoryServices.updatedCategoryIntoDB(req.body, categoryId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category Update successfully!",
      data: result,
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategory,
  updateCategory,
};
