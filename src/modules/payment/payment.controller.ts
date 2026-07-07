import httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;

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


const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;

    await paymentService.handleWebhook(event, signature as string);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Webhook triggered successfully",
      data: null,
    });
  },
);

// get my payment
const getMyPayments = catchAsync(async (req, res) => {
  const tenantId = req.user?.id;

  const result = await paymentService.getMyPaymentsFromDB(
    tenantId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history retrieved successfully.",
    data: result,
  });
});

// get payment details by id
const getPaymentDetails = catchAsync(async (req, res) => {
  const paymentId = req.params.id;

  const result = await paymentService.getPaymentDetailsFromDB(
    paymentId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment details retrieved successfully.",
    data: result,
  });
});


export const paymentController = {
   createCheckoutSession,
   handleWebhook,
   getMyPayments,
   getPaymentDetails
   
}