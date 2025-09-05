import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OTPServices } from "./otp.service";
import { SendResponse } from "../../utils/sendResponse";

const sendOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body;
    await OTPServices.sendOTP(email, name);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP send successfully.",
      data: null,
    });
  }
);

const verifyOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    await OTPServices.verifyOTP(email, otp);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OTP verify successful.",
      data: null,
    });
  }
);

export const OTPControllers = {
  sendOTP,
  verifyOTP,
};
