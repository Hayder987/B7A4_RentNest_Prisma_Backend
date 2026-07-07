import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import {
  ICreateRentalRequest,
  IUpdateRentalRequestStatus,
} from "./rentalReuest.interface";
import { RentalStatus, Role } from "../../../generated/prisma/enums";

// create rental request
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

// get my rental request
const getMyRentalRequestsFromDB = async (tenantId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          location: true,
          price: true,
          available: true,
          image: true,
        },
      },
    },
  });

  const formattedRental = result.map((rental) => ({
    ...rental,
    property: {
      ...rental.property,
      price: Number(rental.property.price),
    },
  }));

  return formattedRental;
};

// get rental details request by id
const getRentalDetailsFromDB = async (
  rentalId: string,
  userId: string,
  role: Role,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalId,
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
        include: {
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!rental) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Rental request not found In Database",
    );
  }

  if (role === Role.ADMIN) {
  } else if (role === Role.LANDLORD) {
    if (rental.property.landlordId !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "FORBIDDEN: You are not authorized to access this rental request.",
      );
    }
  } else if (role === Role.TENANT) {
    if (rental.tenantId !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "FORBIDDEN: You are not authorized to access this rental request.",
      );
    }
  } else {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "FORBIDDEN: You are not authorized to access this rental request.",
    );
  }

  return {
    ...rental,
    property: {
      ...rental.property,
      price: Number(rental.property.price),
    },
  };
};

// landLord Services -------------->

// get landlord all rental request
const getLandlordRentalRequestsFromDB = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    orderBy: {
      createdAt: "desc",
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
          image: true,
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

  const formattedResult = result.map((rental) => ({
    ...rental,
    property: {
      ...rental.property,
      price: Number(rental.property.price),
    },
  }));

  return formattedResult;
};

// rental status Approve / Reject Request update
const updateRentalRequestStatusIntoDB = async (
  rentalRequestId: string,
  landlordId: string,
  payload: IUpdateRentalRequestStatus,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
    },
  });

 
  if (!rentalRequest) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found.");
  }

  // check own landlord property
  if (rentalRequest?.property?.landlordId !== landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "FORBIDDEN: You are not authorized to update this rental request.",
    );
  }

  // Current status is PENDING
  if (rentalRequest.status !== RentalStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending rental requests can be updated.",
    );
  }

  const result = await prisma.rentalRequest.update({
    where: {
      id: rentalRequestId,
    },
    data: {
      status: payload.status,
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
          image: true,
        },
      },
    },
  });

  return {
    ...result,
    property: {
      ...result.property,
      price: Number(result.property.price),
    },
  };
};

export const rentalRequestServices = {
  createRentalRequestIntoDB,
  getMyRentalRequestsFromDB,
  getRentalDetailsFromDB,
  getLandlordRentalRequestsFromDB,
  updateRentalRequestStatusIntoDB,
};
