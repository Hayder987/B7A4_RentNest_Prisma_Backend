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

// get my rental req
router.get("/", auth(Role.TENANT), rentalRequestController.getMyRentalRequests);

// get rental details
router.get(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  rentalRequestController.getRentalDetails,
);

export const rentalRequestRoutes = router;
