import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
} from "./category.validation";

const router = Router();

router.post(
  "/",
  validateRequest(createCategoryValidationSchema),
  auth(Role.ADMIN),
  categoryController.createCategory,
);

router.get("/", categoryController.getAllCategory);

router.patch(
  "/:id",
  validateRequest(updateCategoryValidationSchema),
  auth(Role.ADMIN),
  categoryController.updateCategory,
);

router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);


export const categoryRoutes = router;
