
import { z } from "zod";
import { Role, UserStatus } from "../../../generated/prisma/enums";

// create user zod schema req.body
export const createUserValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters"),

  email: z
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),

  role: z.enum([Role.LANDLORD, Role.TENANT]).optional(),
}).strict();


// Update user zod schema req.body
export const updateUserValidationSchema = z
  .object({
    role: z.enum(Role).optional(),
    status: z.enum(UserStatus).optional(),
  })
  .strict()
  .refine(
    (data) => data.role !== undefined || data.status !== undefined,
    {
      message: "At least one field (role or status) is required.",
    }
  );

  // login user zod schema req.body
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