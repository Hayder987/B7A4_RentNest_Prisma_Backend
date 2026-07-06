import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Role, UserStatus } from "../../generated/prisma/enums";
import AppError from "../Error/AppError";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const auth = (...requiredRole: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "you are not logged in Please Login and generate Token",
      );
    };

     const decodedToken = jwtUtils.verifyToken(token, config.jwt_access_secret) as JwtPayload;

      if(!decodedToken.success){
        throw new AppError(httpStatus.UNAUTHORIZED, decodedToken.error)
    }

     const { email, name, id, role } = decodedToken.data;

    //  role wise access check
     if(requiredRole.length && !requiredRole.includes(role)){
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden. You don't have permission to access this resource.");
     };

      const user = await prisma.user.findUnique({
        where : {email, name, id, role}
     });

     if(!user){
         throw new AppError(httpStatus.NOT_FOUND, "User not found. Please log in again.");
     }

      if(user.status === UserStatus.BLOCKED){
       throw new AppError(httpStatus.FORBIDDEN, "Your account has been Blocked. Please contact support Email."); 
     };

       const decodedUser = decodedToken?.data
       req.user = decodedUser;

       next();

  });
};
