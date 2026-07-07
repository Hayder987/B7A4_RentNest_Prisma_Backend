import { RentalStatus } from "../../../generated/prisma/enums";

export interface ICreateRentalRequest {
  propertyId: string;
}

export interface IUpdateRentalRequestStatus {
  status: Extract<RentalStatus, "APPROVED" | "REJECTED">;
}