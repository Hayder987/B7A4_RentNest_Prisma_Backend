import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateProperty } from "./property.interface";
import { Role, UserStatus } from "../../../generated/prisma/enums";

// create landlordProperties
const createPropertiesIntoDB = async (
  landlordId: string,
  payload: ICreateProperty,
) => {
  // landlord exists?
  const landlord = await prisma.user.findUnique({
    where: {
      id: landlordId,
      role: Role.LANDLORD,
      status: UserStatus.ACTIVE,
    },
  });

  if (!landlord) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "UNAUTHORIZED: You have No Permission! Need Landlord Role",
    );
  }

  // category exists?
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category does not exist in DataBase. Please provide a valid category ID");
  }

  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
    },
  });

  return {
    ...result,
    price: Number(result.price),
  };
};

export const propertiesService = {
  createPropertiesIntoDB,
};
