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
const getMyRentalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;

    const result = await rentalRequestServices.getMyRentalRequestsFromDB(
      tenantId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully!",
      data: result,
    });
  },
);

// get rental details req by id
const getRentalDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalId = req.params.id;
    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await rentalRequestServices.getRentalDetailsFromDB(
      rentalId as string,
      userId as string,
      role,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental details retrieved successfully.",
      data: result,
    });
  },
);

// landlord Rental controller --------------------->

// get landlord rental request
const getLandlordRentalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;

    const result = await rentalRequestServices.getLandlordRentalRequestsFromDB(
      landlordId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully.",
      data: result,
    });
  },
);

// rental status Approve / Reject Request update
const updateRentalRequestStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalRequestId = req.params.id;
    const landlordId = req.user?.id;
    const payload = req.body;

    const result = await rentalRequestServices.updateRentalRequestStatusIntoDB(
      rentalRequestId as string,
      landlordId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request status updated successfully.",
      data: result,
    });
  },
);

//Optional:rental status Completed Request update after payment
const updateCompletedRentalStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const rentalId = req.params.id;

    const result =
      await rentalRequestServices.updateCompletedRentalStatusIntoDB(
        landlordId as string,
        rentalId as string,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental marked as completed successfully.",
      data: result,
    });
  },
);

export const rentalRequestController = {
  postRentalRequest,
  getMyRentalRequests,
  getRentalDetails,
  getLandlordRentalRequests,
  updateRentalRequestStatus,
  updateCompletedRentalStatus,
};
