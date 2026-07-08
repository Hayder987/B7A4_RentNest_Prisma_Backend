import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminUserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateUserStatusSchema } from "./user.validation";

const router = Router();

// get all users
router.get("/users", auth(Role.ADMIN), adminUserController.getAllUsers);

// update user status
router.patch(
  "/users/:id",
  validateRequest(updateUserStatusSchema),
  auth(Role.ADMIN),
  adminUserController.updateUserStatus,
);

// get all properties
router.get(
  "/properties",
  auth(Role.ADMIN),
  adminUserController.getAllProperties
);

// get all rental request
router.get(
  "/rentals",
  auth(Role.ADMIN),
  adminUserController.getAllRentalsRequest
);

export const adminUserRoutes = router;
