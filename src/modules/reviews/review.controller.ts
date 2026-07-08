import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await reviewService.createReviewIntoDB(req.user?.id as string, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully.",
      data: {review},
    });
  },
);


// get review by id
const getReviewById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) =>{

    const review = await reviewService.getReviewByIdIntoDB(req.params?.id as string)
   
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review Retrieve successfully.",
      data: {review},
    });
  }
)

export const reviewController = {
  createReview,
  getReviewById
};
