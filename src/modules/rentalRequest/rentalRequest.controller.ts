import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalRequestServices } from "./rentalRequest.service";

const postRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const payload = req.body;

    const result = await rentalRequestServices.createRentalRequestIntoDB(
      tenantId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your Rental Request Created successfully!",
      data: result,
    });
  },
);

export const rentalRequestController = {
  postRentalRequest,
};
