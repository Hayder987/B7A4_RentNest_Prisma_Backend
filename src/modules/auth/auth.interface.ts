import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  role?: Extract<Role, "LANDLORD" | "TENANT">;
}

export type IUpdateUser = {
  role?: Role;
  status?: UserStatus;
};

export interface ILoginUser {
    email: string,
    password: string
};