import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { SendResponse } from "../../utils/sendResponse";
import { setAuthCookies } from "../../utils/setCookies";
import AppError from "../../errorHelpers/appError";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/createUserToken";
import passport from "passport";

const credentialLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) {
        return next(new AppError(401, error));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userToken = createUserToken(user);

      setAuthCookies(res, userToken);

      const { password: _, ...rest } = user.toObject();

      SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User Loged in successfully",
        data: {
          ...userToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

const getAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(404, "Refresh Token not found.");
    }

    const result = await AuthServices.getAccessToken(refreshToken);

    setAuthCookies(res, result.data);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Loged in successfully",
      data: result.data,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Loged out successfully",
      data: null,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await AuthServices.forgotPassword(req.body);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user as JwtPayload;

    await AuthServices.changePassword(oldPassword, newPassword, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    await AuthServices.resetPassword(req.body, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    await AuthServices.setPassword(decodedToken.userId, req.body);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password ste successfully",
      data: null,
    });
  }
);

// google auth passport controller
const googleAuthCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let redirectTo = (req.query.state as string) || "/";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    const result = createUserToken(user);

    setAuthCookies(res, result);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialLogin,
  getAccessToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  setPassword,
  googleAuthCallback,
};
