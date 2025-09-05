import { Router } from "express";
import { OTPControllers } from "./otp.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { sendOtpZodSchema, verifyOtpZodSchema } from "./otp.validation";

const router = Router();

router.post("/send", validateRequest(sendOtpZodSchema), OTPControllers.sendOTP);
router.post(
  "/verify",
  validateRequest(verifyOtpZodSchema),
  OTPControllers.verifyOTP
);

export const OTPRouter = router;
