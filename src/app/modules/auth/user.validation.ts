import z from "zod";

export const setUserPasswordZodSchema = z.object({
  password: z
    .string({ invalid_type_error: "Password must be string." })
    .min(6, { message: "Password should contain minimum 6 characters" })
    .max(32, { message: "Password should not larger than 32 character" }),
});

export const changeUserPasswordZodSchema = z.object({
  oldPassword: z.string(),
  newPassword: z
    .string({ invalid_type_error: "Password must be string." })
    .min(6, { message: "Password should contain minimum 6 characters" })
    .max(32, { message: "Password should not larger than 32 character" }),
});

export const forgotPasswordZodSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordZodSchema = z.object({
  id: z.string(),
  newPassword: z.string(),
});
