
import { z } from "zod";
import { Role } from "../../../generated/prisma/enums";

export const createUserValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 50 characters"),

  email: z
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),

  role: z.enum(Role).optional(),
});

export const updateUserValidationSchema =
  createUserValidationSchema.partial();

export const loginValidationSchema = z.object({
  email: z
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters"),
});