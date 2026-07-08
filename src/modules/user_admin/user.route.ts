import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminUserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateUserStatusSchema } from "./user.validation";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminUserController.getAllUsers);

router.patch(
  "/users/:id",
  validateRequest(updateUserStatusSchema),
  auth(Role.ADMIN),
  adminUserController.updateUserStatus,
);

export const adminUserRoutes = router;
