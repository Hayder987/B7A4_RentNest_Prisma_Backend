import { Router } from "express";
import { propertiesController } from "./property.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createPropertyValidationSchema } from "./property.validation";

const router = Router();

router.post(
  "/landlord",
  validateRequest(createPropertyValidationSchema),
  auth(Role.LANDLORD),
  propertiesController.createProperties,
);

router.get("/", propertiesController.getAllProperties);

export const propertiesRoutes = router;
