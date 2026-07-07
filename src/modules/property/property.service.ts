import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import {
  ICreateProperty,
  IPropertyFilterRequest,
  IUpdateAvailability,
  IUpdateProperty,
} from "./property.interface";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { PropertyWhereInput } from "../../../generated/prisma/models";

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
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category does not exist in DataBase. Please provide a valid category ID",
    );
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

// get all properties Public
const getAllPropertiesFromDB = async (query: IPropertyFilterRequest) => {
  const location = query.location?.trim();
  const minPrice = query?.minPrice ? Number(query?.minPrice) : undefined;
  const maxPrice = query?.maxPrice ? Number(query?.maxPrice) : undefined;
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const type = query.type?.trim();

  const andCondition: PropertyWhereInput[] = [];

  if (location) {
    andCondition.push({
      OR: [
        {
          location: {
            contains: location,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query?.searchTerm) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: query?.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query?.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Price filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    andCondition.push({
      price: {
        ...(minPrice !== undefined && {
          gte: minPrice,
        }),
        ...(maxPrice !== undefined && {
          lte: maxPrice,
        }),
      },
    });
  }

  if (type) {
    andCondition.push({
      category: {
        name: {
          contains: type,
          mode: "insensitive",
        },
      },
    });
  }

  if (query?.landlordId) {
    andCondition.push({
      landlordId: query?.landlordId,
    });
  }

  const properties = await prisma.property.findMany({
    where: {
      AND: andCondition,
    },

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

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
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  const totalProperty = await prisma.property.count({
    where: {
      AND: andCondition,
    },
  });

  const formattedProperties = properties.map((property) => ({
    ...property,
    price: Number(property.price),
  }));

  return {
    data: formattedProperties,
    meta: {
      page: page,
      limit: limit,
      total: totalProperty,
      totalPages: Math.ceil(totalProperty / limit),
    },
  };
};

// get properties by id
const getPropertiesByIdFromDB = async (propertyId: string) => {
  const result = await prisma.property.findFirstOrThrow({
    where: {
      id: propertyId,
    },
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
      _count: {
        select: {
          rentals: true,
          reviews: true,
        },
      },
    },
  });

  return {
    ...result,
    price: Number(result.price),
  };
};

// update properties by id
const updatePropertiesByIdIntoDB = async (
  propertyId: string,
  userId: string,
  payload: IUpdateProperty,
) => {
  // Check payload
  if (Object.keys(payload).length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No update data provided.");
  }

  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId,
    },
  });

  if (userId !== property?.landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "FORBIDDEN:This Property is not Yours! You Have no Permission:This Property is not Yours! You Have no Permission",
    );
  }

  // Validate category if updating
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
    }
  }

  const result = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: {
      ...payload,
    },
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
  });

  return {
    ...result,
    price: Number(result.price),
  };
};

// delete property by id
const deletePropertyByIdFromDB = async (userId: string, propertyId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const property = await tx.property.findUniqueOrThrow({
      where: {
        id: propertyId,
      },
    });

    if (userId !== property?.landlordId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "FORBIDDEN:This Property is not Yours! You Have no Permission",
      );
    }

    const result = await tx.property.delete({
      where: {
        id: propertyId,
      },
      select: {
        id: true,
        title: true,
        location: true,
        price: true,
        landlordId: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedResult = {
      ...result,
      price: Number(result.price),
    };

    // Optional for record keeping deleted properties
    await tx.deletedProperty.create({
      data: {
        title: formattedResult?.title,
        propertyId: formattedResult?.id,
        location: formattedResult?.location,
        price: formattedResult?.price,
        landlordId: formattedResult?.landlordId,
        categoryName: formattedResult?.category?.name,
      },
    });
    return formattedResult;
  });
  return transactionResult;
};

// update Availability by id
const updateAvailabilityIntoDB = async (
  propertyId: string,
  userId: string,
  payload: IUpdateAvailability,
) => {
  // Check property exists
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found.");
  }

  // here check own properties
  if (property.landlordId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "FORBIDDEN:This Property is not Yours! You Have no Permission",
    );
  }

  const result = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: {
      available: payload.available,
    },
  });
  return result;
};

// Optional : get deleted properties by Admin
const getDeletedPropertiesFromDB = async () => {
  const data = await prisma.deletedProperty.findMany({
    orderBy: {
      deletedAt: "desc",
    },
  });
  const total = await prisma.deletedProperty.count();
  
  return {
    data,
    total
  }
};

export const propertiesService = {
  createPropertiesIntoDB,
  getAllPropertiesFromDB,
  getPropertiesByIdFromDB,
  updatePropertiesByIdIntoDB,
  deletePropertyByIdFromDB,
  updateAvailabilityIntoDB,
  getDeletedPropertiesFromDB,
};
