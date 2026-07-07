
import { z } from "zod";
import { RentalStatus } from "../../../generated/prisma/enums";

export const createRentalRequestValidationSchema = z
  .object({
    propertyId: z.uuid("Invalid property id."),
  })
  .strict();



export const updateRentalRequestStatusValidationSchema = z
  .object({
    status: z.enum([
      RentalStatus.APPROVED,
      RentalStatus.REJECTED,
    ]),
  })
  .strict();