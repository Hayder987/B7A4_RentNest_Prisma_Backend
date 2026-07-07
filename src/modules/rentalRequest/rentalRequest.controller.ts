import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalRequestServices } from "./rentalRequest.service";

// create rental request
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

// get my rental request
const getMyRentalRequests = catchAsync (
  async (req: Request, res: Response, next: NextFunction) =>{
    const tenantId = req.user?.id;

    const result = await rentalRequestServices.getMyRentalRequestsFromDB(tenantId as string)
    
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully!",
      data: result,
    });
  }  
)

export const rentalRequestController = {
  postRentalRequest,
  getMyRentalRequests
};
