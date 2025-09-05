import z from "zod";

export const sendOtpZodSchema = z.object({
  email: z.string().email(),
  name: z.string(),
});

export const verifyOtpZodSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
});
