import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/",auth(Role.ADMIN), categoryController.createCategory);
router.get("/", )

export const categoryRoutes = router;