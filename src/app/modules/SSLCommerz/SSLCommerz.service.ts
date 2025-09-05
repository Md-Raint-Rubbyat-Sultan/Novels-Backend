import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "./SSLCommerz.interface";

const SSLCommerzInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL.STORE_ID,
      store_passwd: envVars.SSL.STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
      cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
      ipn_url: envVars.SSL.SSL_IPN_URL,
      shipping_method: "N/A",
      product_name: "Tour",
      product_category: "Service",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "1000",
      ship_country: "N/A",
    };

    // To convert each value of data into string
    const stringifiedData: Record<string, string> = Object.entries(data).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    );

    const fetchRes = await fetch(envVars.SSL.SSL_PAYMENT_API, {
      method: "POST",
      body: new URLSearchParams(stringifiedData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return {
      data: await fetchRes.json(),
    };
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
};

const SSLValidation = async (payload: any) => {
  try {
    const result = await fetch(
      `${envVars.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL.STORE_ID}&store_passwd=${envVars.SSL.STORE_PASS}`
    );

    const data = await result.json();

    console.log("SSLValidation function", data);

    await Payment.findOneAndUpdate(
      { transactionId: payload.tran_id },
      { paymentGatewayData: data },
      { runValidators: true }
    );
  } catch (error: any) {
    throw new AppError(401, `Payment validation error: ${error.message}`);
  }
};

export const SSLServices = {
  SSLCommerzInit,
  SSLValidation,
};
