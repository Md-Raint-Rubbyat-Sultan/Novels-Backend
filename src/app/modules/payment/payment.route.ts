import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../user/user.interface";
import { PaymentControllers } from "./payment.controller";
import { makePaymentZodValidation } from "./payment.validation";

const router = Router();

router.post(
  "/make-payment",
  checkAuth(...Object.values(Role)),
  validateRequest(makePaymentZodValidation),
  PaymentControllers.makePayment
);
router.post("/success", PaymentControllers.successPayment);
router.post("/fail", PaymentControllers.failedPayment);
router.post("/cancel", PaymentControllers.cancelPayment);
router.post("/validate-payment", PaymentControllers.validatePayment);
router.post(
  "/invoice/:id",
  checkAuth(...Object.values(Role)),
  PaymentControllers.getPDFDownloadLink
);

export const PaymentRouter = router;
