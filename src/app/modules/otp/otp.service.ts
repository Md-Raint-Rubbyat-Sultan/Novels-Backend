import crypto from "crypto";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/appError";
import { redisClint } from "../../config/redis.confg";
import { sendEmailOptions } from "../../utils/sendEmail";

const OTP_EXPIRES = 2 * 60;

const generateOTP = (length = 6) => {
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  if (user.isVarified) {
    throw new AppError(401, "You are already verified.");
  }

  const otp = generateOTP();

  const redisKey = `otp:${email}`;

  await redisClint.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRES,
    },
  });

  sendEmailOptions({
    to: email,
    subject: "Verification OTP",
    templateName: "otp",
    templateData: {
      name,
      otp,
    },
  });
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  if (user.isVarified) {
    throw new AppError(401, "You are already verified.");
  }

  const redisKey = `otp:${email}`;

  const saveOTP = await redisClint.get(redisKey);

  if (!saveOTP || saveOTP !== otp) {
    throw new AppError(401, "Invalid OTP");
  }

  await Promise.all([
    User.findOneAndUpdate(
      { email },
      { isVarified: true },
      { runValidators: true }
    ),
    redisClint.del(redisKey),
  ]);
};

export const OTPServices = {
  sendOTP,
  verifyOTP,
};
