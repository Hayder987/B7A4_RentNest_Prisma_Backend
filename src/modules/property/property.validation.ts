import { z } from "zod";

export const createPropertyValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  location: z
    .string()
    .trim()
    .min(3, "Location is required")
    .max(255, "Location cannot exceed 255 characters"),

  price: z
    .number({
      error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),

  image: z.url("Please provide a valid image URL").optional(),

  available: z.boolean().optional(),

  categoryId: z.uuid("Invalid category id"),
});

export const updatePropertyValidationSchema =
  createPropertyValidationSchema.partial();

export const updateAvailabilitySchema = z.object({
  available: z.boolean({
    error: "Available status must be a boolean.",
  }),
}).strict();
