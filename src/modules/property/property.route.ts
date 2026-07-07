import { Router } from "express";
import { propertiesController } from "./property.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createPropertyValidationSchema,
  updateAvailabilitySchema,
  updatePropertyValidationSchema,
} from "./property.validation";

const router = Router();

router.post(
  "/landlord",
  validateRequest(createPropertyValidationSchema),
  auth(Role.LANDLORD),
  propertiesController.createProperties,
);

router.get("/", propertiesController.getAllProperties);

router.get("/:id", propertiesController.getPropertiesById);

router.patch(
  "/:id",
  validateRequest(updatePropertyValidationSchema),
  auth(Role.LANDLORD),
  propertiesController.updatePropertyById,
);

router.delete(
  "/:id",
  auth(Role.LANDLORD),
  propertiesController.deletePropertyById,
);

// update available status
router.patch(
  "/:id/availability",
  validateRequest(updateAvailabilitySchema),
  auth(Role.LANDLORD),
  propertiesController.updateAvailability,
);

export const propertiesRoutes = router;
