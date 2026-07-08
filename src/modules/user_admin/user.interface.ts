import { UserWhereInput } from "../../../generated/prisma/models";

export interface IGetUsersQuery extends UserWhereInput {
  searchTerm?: string;
  page?: string;
  limit?: string;
}