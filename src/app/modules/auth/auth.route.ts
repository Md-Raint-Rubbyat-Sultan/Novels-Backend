import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { validateRequest } from "../../middleware/validateRequest";
import {
  changeUserPasswordZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
  setUserPasswordZodSchema,
} from "./user.validation";
import { envVars } from "../../config/env";

const router = Router();

router.post("/login", AuthControllers.credentialLogin);
router.post("/refresh-token", AuthControllers.getAccessToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/change-password",
  validateRequest(changeUserPasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword
);
router.post(
  "/set-password",
  validateRequest(setUserPasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.setPassword
);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordZodSchema),
  AuthControllers.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordZodSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

// google auth with passport
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query?.redirect;

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=there are some issues with your account. Please contact to our team.`,
  }),
  AuthControllers.googleAuthCallback
);

export const AuthRouter = router;
