
import { z } from "zod";

export const createCategoryValidationSchema = z.object({
  name: z
    .string({
      error: "Category name must be a string",
    })
    .trim()
    .min(3, {
      error: "Category name is required and minimum 3 Char",
    })
    .max(50, {
      error: "Category name cannot exceed 50 characters",
    }),
});

export const updateCategoryValidationSchema =
  createCategoryValidationSchema.partial();