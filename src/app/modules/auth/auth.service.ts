import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { createUserAccessTokenWithRefreshToken } from "../../utils/createUserToken";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { IAuthProvider, IsActive } from "../user/user.interface";
import { sendEmailOptions } from "../../utils/sendEmail";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";

const getAccessToken = async (refreshToken: string) => {
  const accessToken = await createUserAccessTokenWithRefreshToken(refreshToken);

  return { data: { accessToken } };
};

const forgotPassword = async (email: string) => {
  const isUserExisted = await User.findOne({ email });

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

  const JwtPayload = {
    userId: isUserExisted._id,
    email: isUserExisted.email,
    role: isUserExisted.role,
  };

  const resetToken = jwt.sign(JwtPayload, envVars.JWT_AUTH_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExisted._id}&token=${resetToken}`;

  sendEmailOptions({
    to: email,
    subject: "Reset Password",
    templateName: "forgetPasswordTemplate",
    templateData: {
      name: isUserExisted.name,
      resetUILink,
    },
  });
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const matchOldPassword = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );

  if (!matchOldPassword) {
    throw new AppError(403, "Old password does not match.");
  }

  user!.password = newPassword;

  user!.save();
};

const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id !== decodedToken.userId) {
    throw new AppError(401, "Your are unable to reset password.");
  }

  const isUsreExist = await User.findById(decodedToken.userId);
  if (!isUsreExist) {
    throw new AppError(401, "User does not exist");
  }

  isUsreExist.password = payload.newPassword;

  await isUsreExist.save();
};

const setPassword = async (userId: string, payload: { password: string }) => {
  const isUsreExist = await User.findById(userId);

  if (!isUsreExist) {
    throw new AppError(404, "User not found,");
  }

  if (
    isUsreExist.password &&
    isUsreExist.auth.some(
      (providerObject) => providerObject.provider === "google"
    )
  ) {
    throw new AppError(
      400,
      "User already has a pssword. Please login and then change the Password from user profile."
    );
  }

  const auths: IAuthProvider[] = [
    ...isUsreExist.auth,
    { provider: "credentials", providerId: isUsreExist.email },
  ];

  isUsreExist.password = payload.password;
  isUsreExist.auth = auths;

  await isUsreExist.save();
};

export const AuthServices = {
  getAccessToken,
  forgotPassword,
  changePassword,
  resetPassword,
  setPassword,
};
