import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../errorHelpers/appError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken || req.headers.authorization;

    if (!accessToken) {
      throw new AppError(403, "No Token Recived.");
    }

    const verifiedToken = verifyToken(
      accessToken,
      envVars.JWT_AUTH_SECRET
    ) as JwtPayload;

    const isUserExisted = await User.findById(verifiedToken.userId);

    if (!isUserExisted) {
      throw new AppError(404, "User do not exist.");
    }

    if (!isUserExisted.isVarified) {
      throw new AppError(400, "User is not verified.");
    }

    if (
      isUserExisted.isActive === IsActive.BLOCKED ||
      isUserExisted.isActive === IsActive.INACTIVE
    ) {
      throw new AppError(400, `User is ${isUserExisted.isActive}.`);
    }

    if (isUserExisted.isDeleted) {
      throw new AppError(400, "User is deleted.");
    }

    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(403, "You are not permited to view this route.");
    }

    req.user = verifiedToken;

    next();
  });
