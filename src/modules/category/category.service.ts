import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";

// create category
const createCategoryInDB = async (payload: ICreateCategory) => {
  const { name } = payload;
  const existCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existCategory) {
    throw new AppError(
      httpStatus.CONFLICT,
      `${existCategory?.name} Already Exists In DataBase`,
    );
  }

  const result = await prisma.category.create({
    data: {
      ...payload,
    },
  });

  return result;
};

// get all category from db
const getAllCategoryFromDB = async () => {
  const categories = await prisma.category.findMany({
    include: {
      properties: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: {
          properties: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const totalCategory = await prisma.category.count();

  return {
    categories,
    totalCategory
  }
};

export const categoryServices = {
  createCategoryInDB,
  getAllCategoryFromDB,
};
