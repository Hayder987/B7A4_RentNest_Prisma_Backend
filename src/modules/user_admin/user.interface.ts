import { UserStatus } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";

export interface IGetUsersQuery extends UserWhereInput {
  searchTerm?: string;
  page?: string;
  limit?: string;
}


export interface IUpdateUserStatus {
  status: UserStatus;
}