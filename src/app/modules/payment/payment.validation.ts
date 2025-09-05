import z from "zod";
import { Subscription_Type } from "./payment.interface";

export const makePaymentZodValidation = z.object({
  amount: z.number().min(0, { message: "Invalide payment amount." }),
  subscriptionType: z.enum(
    Object.values(Subscription_Type) as [string, ...string[]]
  ),
});
