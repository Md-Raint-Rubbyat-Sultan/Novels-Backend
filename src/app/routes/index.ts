import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { PaymentRouter } from "../modules/payment/payment.route";
import { BookRouter } from "../modules/book/book.route";
import { ReviewRouter } from "../modules/review/review.route";
import { StatsRoute } from "../modules/stats/stats.route";

export const router = Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/book",
    route: BookRouter,
  },
  {
    path: "/review",
    route: ReviewRouter,
  },
  {
    path: "/payment",
    route: PaymentRouter,
  },
  {
    path: "/stats",
    route: StatsRoute,
  },
  // {
  //   path: "/otp",
  //   route: OTPRouter,
  // },
];

modulesRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});
