import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(Role.TENANT), reviewController.createReview);

// optional: get review by id
router.get("/:id", reviewController.getReviewById);

export const reviewRoutes = router;