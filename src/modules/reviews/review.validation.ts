
import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    rentalRequestId: z.uuid("Invalid rental request id"),

    rating: z
      .number({
        error: "Rating is required",
      })
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5"),

    comment: z
      .string({
        error: "Comment is required",
      })
      .trim()
      .min(5, "Comment must be at least 5 characters")
      .max(500, "Comment cannot exceed 500 characters"),
  }),
});