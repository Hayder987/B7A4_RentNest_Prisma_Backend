import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";
import { formatCategoryName } from "../../utils/formatCategoryName";

// create category
const createCategoryInDB = async (payload: ICreateCategory) => {
  const formattedName = formatCategoryName(payload.name);

  const existCategory = await prisma.category.findUnique({
    where: {
      name: formattedName,
    },
  });

  if (existCategory) {
    throw new AppError(
      httpStatus.CONFLICT,
      `${formattedName} already exists in the database`,
    );
  }

  const result = await prisma.category.create({
    data: {
      name: formattedName,
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
    totalCategory,
  };
};


// update category
const updatedCategoryIntoDB = async (
  payload: ICreateCategory,
  categoryId: string,
) => {
  if (!categoryId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Give Category Id In Routes");
  }

  //   find isExistsCategory
  const isCategoryExists = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const formattedName = formatCategoryName(payload.name);

  //   another category with same name?
  const duplicate = await prisma.category.findFirst({
    where: {
      name: formattedName,
      NOT: {
        id: categoryId,
      },
    },
  });

  if (duplicate) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Category already exists In DataBase",
    );
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: formattedName,
    },
  });

  return updatedCategory;
};

export const categoryServices = {
  createCategoryInDB,
  getAllCategoryFromDB,
  updatedCategoryIntoDB,
};
