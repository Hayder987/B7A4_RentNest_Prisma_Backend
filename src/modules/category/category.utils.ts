import { prisma } from "../../lib/prisma";


export const formatCategoryName = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());
};


export const categoryFindById = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    include:{
      _count : {
        select :{
            properties: true
        }
      }
    }
  });
  return category;
};
