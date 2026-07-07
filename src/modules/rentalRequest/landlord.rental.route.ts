import { rentalRequestController } from "./rentalRequest.controller";
import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/requests",
  auth(Role.LANDLORD),
  rentalRequestController.getLandlordRentalRequests,
);

export const landlordRoutes = router;
