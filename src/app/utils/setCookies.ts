import { Response } from "express";

export interface AuthTokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookies = (res: Response, tokenInfo: AuthTokenInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
};
