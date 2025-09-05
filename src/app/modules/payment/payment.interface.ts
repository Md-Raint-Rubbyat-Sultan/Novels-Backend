import { Types } from "mongoose";

export enum Payment_Status {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCLLED = "CANCLLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum Subscription_Type {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface IPaymet {
  userId: Types.ObjectId;
  transactionId: string;
  amount: number;
  subscriptionType: Subscription_Type;
  paymentGatewayData?: any;
  invoiceUrl?: string;
  status: Payment_Status;
}
