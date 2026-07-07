import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateRentalRequest } from "./rentalReuest.interface";
import { RentalStatus } from "../../../generated/prisma/enums";

const createRentalRequestIntoDB = async (
  tenantId: string,
  payload: ICreateRentalRequest,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
    include: {
      category: true,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found.");
  }

  if (!property.available) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This property is not available for rent.",
    );
  }

  // Own property check
  if (property.landlordId === tenantId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot request your own property.",
    );
  }

  // Duplicate pending request
  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: RentalStatus.PENDING,
    },
  });

  if (existingRequest) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You already have a pending request for this property.",
    );
  }

  const result = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
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
          price: true,
          available: true,
        },
      },
    },
  });

  return result;
};

export const rentalRequestServices = {
  createRentalRequestIntoDB,
};
