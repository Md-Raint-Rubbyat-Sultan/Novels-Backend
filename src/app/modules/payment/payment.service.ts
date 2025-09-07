import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/appError";
import { createTransactionId } from "../../utils/createTransaction";
import { ISSLCommerz } from "../SSLCommerz/SSLCommerz.interface";
import { SSLServices } from "../SSLCommerz/SSLCommerz.service";
import { User } from "../user/user.model";
import {
  IPaymet,
  Payment_Status,
  Subscription_Type,
} from "./payment.interface";
import { Payment } from "./payment.model";
import { IUser } from "../user/user.interface";
import { redisClint } from "../../config/redis.confg";

const today = new Date();
const afterThirthyDays = today.setDate(today.getDate() + 30);
const afterAYear = today.setDate(today.getDate() + 365);

const makePayment = async (
  payload: Pick<IPaymet, "amount" | "subscriptionType">,
  decodedToken: JwtPayload
) => {
  const transactionId = createTransactionId();

  const session = await Payment.startSession();
  session.startTransaction();

  const isUserExist = await User.findById(decodedToken.userId);

  if (!isUserExist) {
    throw new AppError(404, "User not found.");
  }

  if (isUserExist.subscribe) {
    throw new AppError(400, "You are already in a plan.");
  }

  const isUnpaidPaymentExist = await Payment.findOne({
    _id: isUserExist._id,
    status: Payment_Status.UNPAID,
  });

  try {
    const SSLPayload: ISSLCommerz = {
      address: isUserExist?.address || "N/A",
      amount: payload.amount,
      email: isUserExist.email,
      name: isUserExist.name,
      phoneNumber: isUserExist?.phone || "N/A",
      transactionId,
    };

    const paymentDoc: IPaymet = {
      userId: isUserExist._id,
      amount: payload.amount,
      subscriptionType: payload.subscriptionType,
      transactionId,
      status: Payment_Status.UNPAID,
    };

    if (isUnpaidPaymentExist) {
      isUnpaidPaymentExist.amount = payload.amount;
      isUnpaidPaymentExist.subscriptionType = payload.subscriptionType;

      await isUnpaidPaymentExist.save({ session });

      const SSLPayment = await SSLServices.SSLCommerzInit(SSLPayload);

      await session.commitTransaction();
      session.endSession();

      return {
        data: {
          paymentInfo: isUnpaidPaymentExist,
          paymentUrl: SSLPayment.data.GatewayPageURL || "Faild to payment",
        },
      };
    }

    const createPayment = await Payment.create([paymentDoc], { session });

    const SSLPayment = await SSLServices.SSLCommerzInit(SSLPayload);

    await session.commitTransaction();
    session.endSession();

    return {
      data: {
        paymentInfo: createPayment,
        paymentUrl: SSLPayment.data.GatewayPageURL || "Faild to payment",
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: Payment_Status.PAID },
      { new: true, runValidators: true, session }
    ).populate<{ userId: IUser & { _id: string } }>("userId", "-password");

    if (!updatedPayment) {
      throw new AppError(404, "Payment not found.");
    }

    const SubscriptionInfo = {
      subscribe: true,
      subscriptionType: updatedPayment.subscriptionType,
      subscriptionDate: new Date().toISOString(),
      subscriptionExpires:
        updatedPayment.subscriptionType === Subscription_Type.MONTHLY
          ? new Date(afterThirthyDays).toISOString()
          : new Date(afterAYear).toISOString(),
    };

    const redisKey = `subscription:${updatedPayment?.userId?.email as string}`;

    await redisClint.set(
      redisKey,
      JSON.stringify({ subscribe: SubscriptionInfo.subscribe }),
      {
        expiration: {
          type: "EX",
          value:
            updatedPayment.subscriptionType === Subscription_Type.MONTHLY
              ? 30 * 24 * 60 * 60
              : 365 * 24 * 60 * 60,
        },
      }
    );

    await User.findByIdAndUpdate(
      updatedPayment.userId._id,
      { ...SubscriptionInfo },
      { new: true, runValidators: true, session }
    );

    // const invoiceData = {};

    // const invoicePDF = await generatePDF(invoiceData);

    // const cloudinaryResulst = await uploadImageToCloudinary(
    //   invoicePDF,
    //   "invoice"
    // );

    // if (!cloudinaryResulst) {
    //   throw new AppError(401, "Faild to upload pdf to clouldinary.");
    // }

    // await Payment.findByIdAndUpdate(
    //   updatedPayment._id,
    //   {
    //     invoiceUrl: cloudinaryResulst.secure_url,
    //   },
    //   { runValidators: true, session }
    // );

    // sendEmailOptions({
    //   to: (updatedBooking.user as unknown as IUser).email,
    //   subject: "Subscription Notice",
    //   templateName: "invoice",
    //   templateData: {
    //     userName: invoiceData.userName,
    //     tourTitle: invoiceData.tourTitle,
    //     bookingDate: invoiceData.bookingDate as string,
    //     guestCount: invoiceData.guestCount.toString(),
    //     transactionId: invoiceData.transactionId,
    //     totalAmount: invoiceData.totalAmount.toString(),
    //   },
    //   attachments: [
    //     {
    //       filename: "invoice.pdf",
    //       content: invoicePDF,
    //       contentType: "application/pdf",
    //     },
    //   ],
    // });

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment successfull." };
  } catch (error: any) {
    // some error occur do not implement anything to the real data base
    await session.abortTransaction(); // rollback
    session.endSession();
    throw new AppError(400, error.message);
  }
};

const failedPayment = async (query: Record<string, string>) => {
  await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: Payment_Status.FAILED },
    { runValidators: true }
  );
  return { success: false, message: "Payment failed." };
};

const cancelPayment = async (query: Record<string, string>) => {
  await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: Payment_Status.CANCLLED },
    { runValidators: true }
  );

  return { success: false, message: "Payment canceled." };
};

const getPDFDownloadLink = async (_id: string, userId: string) => {
  // const payment = await Payment.findById(_id)
  //   .select("invoiceUrl booking")
  //   .populate("booking", "user");

  // if (!payment) {
  //   throw new AppError(401, "Payment not found.");
  // }

  // if ((payment.booking as any).user !== userId) {
  //   throw new AppError(403, "You are forbidden to get this link.");
  // }

  // if (!payment.invoiceUrl) {
  //   throw new AppError(401, "Invoice PDF url not found.");
  // }

  return {
    // data: payment.invoiceUrl,
    data: null,
  };
};

const myPayment = async (decodedToken: JwtPayload) => {
  const payments = await Payment.find({ userId: decodedToken.userId }).sort(
    "-createdAt"
  );

  return {
    data: payments,
  };
};

export const PaymentServices = {
  makePayment,
  successPayment,
  failedPayment,
  cancelPayment,
  getPDFDownloadLink,
  myPayment,
};
