import { Types } from "mongoose";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";

export const createUserToken = (
  user: Partial<IUser> & { _id?: Types.ObjectId }
) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_AUTH_SECRET,
    envVars.JWT_AUTH_TIME
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_AUTH_REFRESH_SECRET,
    envVars.JWT_AUTH_REFRESH_TIME
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createUserAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_AUTH_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExisted = await User.findById(verifiedRefreshToken.userId);

  if (!isUserExisted) {
    throw new AppError(404, "User do not exist.");
  }

  if (
    isUserExisted.isActive === IsActive.BLOCKED ||
    isUserExisted.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(400, `User is ${isUserExisted.isActive}.`);
  }

  if (isUserExisted.isDeleted) {
    throw new AppError(400, "User do not exist.");
  }

  const jwtPayload = {
    userId: isUserExisted._id,
    email: isUserExisted.email,
    role: isUserExisted.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_AUTH_SECRET,
    envVars.JWT_AUTH_TIME
  );

  return accessToken;
};
