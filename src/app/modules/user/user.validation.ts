import z from "zod";
import { IsActive, Role, RoleStatus } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string." })
    .min(1, { message: "Name is too short." }),
  email: z
    .string({ invalid_type_error: "Email must be string." })
    .email({ message: "Invalied email address." }),
  password: z
    .string({ invalid_type_error: "Password must be string." })
    .min(6, { message: "Password should contain minimum 6 characters" })
    .max(32, { message: "Password should not larger than 32 character" }),
  phone: z
    .string({ invalid_type_error: "Phone number must be string." })
    .regex(/^(?:\+8801\d{9})|01\d{9}$/, {
      message: "Invalied phone number. Formet: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string." })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string." })
    .min(1, { message: "Name is too short." })
    .optional(),
  phone: z
    .string({ invalid_type_error: "Phone number must be string." })
    .regex(/^(?:\+8801\d[9])|01\d[9]$/, {
      message: "Invalied phone number. Formet: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
    .optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "isDeketed should be true of false" })
    .optional(),
  isVarified: z
    .boolean({ invalid_type_error: "isDeketed should be true of false" })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string." })
    .optional(),
});

export const RoleChangeRequestZodSchema = z.object({
  reqRole: z.enum([Role.ADMIN, Role.WRITER], {
    message: "Can't request for being a user.",
  }),
});

export const updateRoleZodeSchema = z.object({
  isAccepted: z.enum([RoleStatus.ACCEPTED, RoleStatus.CANCELED]),
});
