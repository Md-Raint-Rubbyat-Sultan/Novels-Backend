import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { SSLServices } from "../SSLCommerz/SSLCommerz.service";
import { PaymentServices } from "./payment.service";

const makePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const payload = req.body;

    const result = await PaymentServices.makePayment(payload, decodedToken);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Payment angain.",
      data: result.data,
    });
  }
);

const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.successPayment(
      query as Record<string, string>
    );

    if (result.success) {
      res.redirect(
        `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const failedPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.failedPayment(
      query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(
        `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const cancelPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentServices.cancelPayment(
      query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(
        `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const getPDFDownloadLink = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const { userId } = req.user as JwtPayload;

    const result = await PaymentServices.getPDFDownloadLink(_id, userId);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "PDF Link retrive.",
      data: result.data,
    });
  }
);

const validatePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await SSLServices.SSLValidation(req.body);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "validation send.",
      data: null,
    });
  }
);

export const PaymentControllers = {
  makePayment,
  successPayment,
  failedPayment,
  cancelPayment,
  getPDFDownloadLink,
  validatePayment,
};
