import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import bcrypt from "bcryptjs";
import config from "../../config";

// register user in database
const registerUserIntoDB = async (payload: IRegisterUser) => {
  const { email, password } = payload;

  const existUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User Already Register In DataBase. Please Login!",
    );
  }

//   password hashed
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );


  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  return result;
};


// login user inDataBase

const loginUserIntoDB = async (payload: ILoginUser)=>{
  const {email, password} = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  return user

}


export const authServices = {
  registerUserIntoDB,
  loginUserIntoDB
};
