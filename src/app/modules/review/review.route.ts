import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createReviewZodSchema } from "./review.validation";
import { ReviewControlers } from "./review.controle";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create",
  checkAuth(...Object.values(Role)),
  validateRequest(createReviewZodSchema),
  ReviewControlers.createReview
);

router.get("/all-reviews", ReviewControlers.getAllReviews);

router.get(
  "/my-reviews",
  checkAuth(...Object.values(Role)),
  ReviewControlers.getMyReviews
);

router.get(
  "/writer-reviews",
  checkAuth(Role.WRITER),
  ReviewControlers.getWriterReviews
);

export const ReviewRouter = router;
