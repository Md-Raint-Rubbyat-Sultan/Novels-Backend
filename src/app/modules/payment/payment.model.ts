import { model, Schema } from "mongoose";
import {
  IPaymet,
  Payment_Status,
  Subscription_Type,
} from "./payment.interface";

const paymentSchema = new Schema<IPaymet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    subscriptionType: {
      type: String,
      enum: Object.values(Subscription_Type),
      required: true,
    },
    paymentGatewayData: {
      type: Schema.Types.Mixed,
    },
    invoiceUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(Payment_Status),
      default: Payment_Status.UNPAID,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Payment = model<IPaymet>("Payment", paymentSchema);
