import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminUserController } from "./user.controller";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminUserController.getAllUsers);

export const adminUserRoutes = router;
