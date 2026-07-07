
import { z } from "zod";

export const createRentalRequestValidationSchema = z
  .object({
    propertyId: z.uuid("Invalid property id."),
  })
  .strict();