import  httpStatus  from 'http-status';
import Stripe from "stripe";
import AppError from "../../Error/AppError";
import { prisma } from '../../lib/prisma';
import { PaymentStatus, RentalStatus } from '../../../generated/prisma/enums';

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const rentalRequestId = session.metadata?.rentalRequestId;

  if (!rentalRequestId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental request id not found in metadata.",
    );
  }

  await prisma.$transaction(async (tx) => {
    // Prevent duplicate payment
    const existingPayment = await tx.payment.findUnique({
      where: {
        rentalRequestId,
      },
    });

    if (existingPayment) {
      return;
    }

    const rental = await tx.rentalRequest.findUniqueOrThrow({
      where: {
        id: rentalRequestId,
      },
      include: {
        property: true,
      },
    });

    await tx.payment.create({
      data: {
        rentalRequestId,

        transactionId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? session.id,

        amount: rental.property.price,

        status: PaymentStatus.PAID,

        paidAt: new Date(),
      },
    });

    await tx.rentalRequest.update({
      where: {
        id: rentalRequestId,
      },
      data: {
        status: RentalStatus.ACTIVE,
      },
    });

    await tx.property.update({
      where: {
        id: rental.propertyId,
      },
      data: {
        available: false,
      },
    });
  });
};