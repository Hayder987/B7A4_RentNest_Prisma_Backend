import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createCheckoutSessionValidationSchema } from "./payment.validation";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create",
  auth(Role.TENANT),
  validateRequest(createCheckoutSessionValidationSchema),
  paymentController.createCheckoutSession,
);

router.post("/webhook", paymentController.handleWebhook);

router.get(
  "/",
  auth(Role.TENANT),
  paymentController.getMyPayments,
);

router.get("/:id", auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), )

export const paymentRoutes = router;