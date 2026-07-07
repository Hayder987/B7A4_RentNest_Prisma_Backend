import { z } from "zod";

export const createCheckoutSessionValidationSchema = z
  .object({
    rentalRequestId: z.uuid(),
  })
  .strict();