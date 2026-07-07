import { rentalRequestController } from "./rentalRequest.controller";
import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { updateRentalRequestStatusValidationSchema } from "./rentalRequest.validation";

const router = Router();

router.get(
  "/requests",
  auth(Role.LANDLORD),
  rentalRequestController.getLandlordRentalRequests,
);

router.patch(
  "/requests/:id",
  auth(Role.LANDLORD),
  validateRequest(updateRentalRequestStatusValidationSchema),
  rentalRequestController.updateRentalRequestStatus,
);

export const landlordRoutes = router;
