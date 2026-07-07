import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateProperty, IPropertyFilterRequest } from "./property.interface";
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

      category: true,
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
          reviews : true
        },
      },
    },
  });

  return {
    ...result,
    price: Number(result.price),
  };
};

export const propertiesService = {
  createPropertiesIntoDB,
  getAllPropertiesFromDB,
  getPropertiesByIdFromDB,
};
