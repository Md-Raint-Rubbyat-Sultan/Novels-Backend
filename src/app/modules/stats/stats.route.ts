import { Router } from "express";
import { StatsControllers } from "./stats.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get(
  "/user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsControllers.userStats
);

router.get(
  "/payment",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsControllers.paymentStats
);

router.get(
  "/popular-books",

  StatsControllers.popularBooks
);

router.get(
  "/popular-writers",

  StatsControllers.popularWriters
);

export const StatsRoute = router;
