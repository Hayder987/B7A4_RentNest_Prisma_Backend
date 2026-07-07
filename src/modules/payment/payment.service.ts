import httpStatus from "http-status";
import Stripe from "stripe";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateCheckoutSession } from "./payment.interface";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import { handleCheckoutCompleted } from "./payment.utils";

// create checkout session
const createCheckoutSessionIntoDB = async (
  tenantId: string,
  payload: ICreateCheckoutSession,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: payload.rentalRequestId,
    },
    include: {
      payment: true,
      tenant: true,
      property: true,
    },
  });

  // Rental exists
  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found.");
  }

  // Rental belongs to logged in tenant
  if (rental.tenantId !== tenantId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to pay for this rental.",
    );
  }

  // Rental approved
  if (rental.status !== RentalStatus.APPROVED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental request is not approved.",
    );
  }

  // Payment already completed
  if (rental.payment && rental.payment.status === PaymentStatus.PAID) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment already completed.");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    customer_email: rental.tenant.email,

    line_items: [
      {
        quantity: 1,

        price_data: {
          currency: "usd",

          unit_amount: Number(rental.property.price) * 100,

          product_data: {
            name: rental.property.title,
            description: rental.property.location,
          },
        },
      },
    ],

    metadata: {
      rentalRequestId: rental.id,
      tenantId,
      propertyId: rental.property.id,
    },

    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.app_url}/payment/cancel`,
  });

  return {
    sessionId: session.id,
    checkoutUrl: session.url,
  };
};


// handle webhook and get data
const handleWebhook = async (payload: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe_webhook_secret,
    );
  } catch {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid Stripe webhook signature.",
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    default:
      break;
  }
};

export const paymentService = {
  createCheckoutSessionIntoDB,
  handleWebhook,
};
