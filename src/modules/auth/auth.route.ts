import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createUserValidationSchema,
  loginValidationSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserValidationSchema),
  authController.registerUser,
);

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  authController.loginUser,
);

router.get(
  "/me",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  authController.getUserMe,
);

export const authRoutes = router;
