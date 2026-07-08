import httpStatus from "http-status";
import { RentalStatus, Role, UserStatus } from "../../../generated/prisma/enums";
import {
  PropertyWhereInput,
  RentalRequestWhereInput,
  UserWhereInput,
} from "../../../generated/prisma/models";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import {
  IGetPropertiesQuery,
  IGetRentalsQuery,
  IGetUsersQuery,
  IUpdateUserStatus,
} from "./user.interface";

// get all users from db
const getAllUsersFromDB = async (query: IGetUsersQuery) => {
  const page = query?.page ? Number(query.page) : 1;
  const limit = query?.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const andConditions: UserWhereInput[] = [];

  if (query?.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.role) {
    andConditions.push({
      role: query.role as Role,
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status as UserStatus,
    });
  }

  const users = await prisma.user.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip: skip,
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.user.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: users,
    meta: {
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Block / Unblock User by admin
const updateUserStatus = async (userId: string, payload: IUpdateUserStatus) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (user.status === payload.status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is already ${payload.status}.`,
    );
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: payload.status,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

// get all properties
const getAllPropertiesFromDB = async (query: IGetPropertiesQuery) => {
  const page = query?.page ? Number(query.page) : 1;
  const limit = query?.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const andConditions: PropertyWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  if (query.available !== undefined) {
    andConditions.push({
      available: query.available === "true",
    });
  }

  const properties = await prisma.property.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip: skip,

    orderBy: {
      createdAt: "desc",
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
          name: true,
        },
      },
      rentals: {
        select: {
          id: true,
          status: true,
          payment: {
            select: {
              id: true,
              transactionId: true,
              amount: true,
              status: true,
              paidAt: true,
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
              comment: true,
            },
          },
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

  const total = await prisma.property.count({
    where: {
      AND: andConditions,
    },
  });

  const formattedProperties = properties.map((property) => ({
    ...property,

    price: Number(property.price),

    rentals: property.rentals.map((rental) => ({
      ...rental,

      payment: rental.payment
        ? {
            ...rental.payment,
            amount: Number(rental.payment.amount),
          }
        : null,
    })),
  }));

  return {
    data: formattedProperties,
    meta: {
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// get all rental request
const getAllRentalsRequestFromDB = async (query: IGetRentalsQuery) => {
  const page = query?.page ? Number(query.page) : 1;
  const limit = query?.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const andConditions: RentalRequestWhereInput[] = [];

   if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          tenant: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          tenant: {
            email: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          property: {
            title: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

    if (query.status) {
    andConditions.push({
      status: query.status as RentalStatus,
    });
  }

  const rentals = await prisma.rentalRequest.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip : skip,

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
        },
      },
      payment: {
        select: {
          id: true,
          transactionId: true,
          amount: true,
          status: true,
          paidAt: true,
        },
      },
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
        },
      },
    },
  });

    const formattedRentals = rentals.map((rental) => ({
    ...rental,

    property: {
      ...rental.property,
      price: Number(rental.property.price),
    },

    payment: rental.payment
      ? {
          ...rental.payment,
          amount: Number(rental.payment.amount),
        }
      : null,
  }));

  const total = await prisma.rentalRequest.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: formattedRentals,
    meta: {
      page: page,
      limit: limit,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const adminUserService = {
  getAllUsersFromDB,
  updateUserStatus,
  getAllPropertiesFromDB,
  getAllRentalsRequestFromDB,
};
