import { Role, UserStatus } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IGetUsersQuery } from "./user.interface";

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

export const adminUserService = {
  getAllUsersFromDB,
};
