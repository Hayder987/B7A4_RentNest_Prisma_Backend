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


export const categoryServices = {
  createCategoryInDB,
};
