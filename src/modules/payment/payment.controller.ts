import httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user!.id;

    const result =
      await paymentService.createCheckoutSessionIntoDB(
        tenantId,
        req.body,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully.",
      data: result,
    });
  },
);


export const paymentController = {
   createCheckoutSession 
}