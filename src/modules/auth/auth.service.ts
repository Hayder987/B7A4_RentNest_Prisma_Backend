import httpStatus from "http-status";
import AppError from "../../Error/AppError";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import bcrypt from "bcryptjs";
import config from "../../config";
import { UserStatus } from "../../../generated/prisma/enums";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";

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
const loginUserIntoDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user?.status === UserStatus.BLOCKED) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been Blocked. Please contact support Email.",
    );
  }

  //   password check is correct?
  const isPasswordMatch = await bcrypt.compare(password, user?.password);

  if (!isPasswordMatch) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Password Incorrect, Enter correct Password",
    );
  }

  const { password: _, ...userWithoutPassword } = user;

  // create jwt token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  } as JwtPayload;

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken, refreshToken, user: userWithoutPassword };
};

// get user me personal user
const getUserMeFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit : {
        password : true
    }
  });

  return user;
};

export const authServices = {
  registerUserIntoDB,
  loginUserIntoDB,
  getUserMeFromDB,
};
