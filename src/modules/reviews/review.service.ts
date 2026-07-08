import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";
import AppError from "../../Error/AppError";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";

// create review
const createReviewIntoDB = async (tenantId: string, payload: ICreateReview) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: payload?.rentalRequestId,
    },
    include: {
      payment: true,
      property: true,
      review: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found.");
  }

  // Tenant ownership
  if (rental.tenantId !== tenantId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "FORBIDDEN: You are not authorized to review this rental.",
    );
  }

  // Rental completed
  if (rental.status !== RentalStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Review can only be submitted after rental completion.",
    );
  }

  // Payment successful
  if (!rental.payment || rental.payment.status !== PaymentStatus.PAID) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment has not been completed.",
    );
  }

  // One review per rental
  if (rental.review) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Review already submitted for this rental.",
    );
  }

  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      tenantId,
      propertyId: rental.propertyId,
      rentalRequestId: rental.id,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
    },
  });

  return review;
};

// get review by id
const getReviewByIdIntoDB = async (reviewId: string) => {
  const result = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      tenant: {
        select: {
          name: true,
          email: true,
        },
      },
      rentalRequest: {
        select: {
          status: true,
        },
      },
      property: {
        select: {
          title: true,
          available: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Review Not Found!");
  }

  return result;
};

export const reviewService = {
  createReviewIntoDB,
  getReviewByIdIntoDB,
};
