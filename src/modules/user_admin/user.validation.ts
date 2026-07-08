import { z } from "zod";
import { UserStatus } from "../../../generated/prisma/enums";

export const updateUserStatusSchema = z.object({
  status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED]),
}).strict();
