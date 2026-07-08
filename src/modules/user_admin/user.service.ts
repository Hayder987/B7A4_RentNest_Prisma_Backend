import httpStatus from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import { IGetUsersQuery, IUpdateUserStatus } from "./user.interface";

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

  return updatedUser
};

export const adminUserService = {
  getAllUsersFromDB,
  updateUserStatus,
};
