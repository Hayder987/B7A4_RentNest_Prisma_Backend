import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createRentalRequestValidationSchema } from "./rentalRequest.validation";

const router = Router();

router.post(
  "/",
  validateRequest(createRentalRequestValidationSchema),
  auth(Role.TENANT),
  rentalRequestController.postRentalRequest,
);

export const rentalRequestRoutes = router;
