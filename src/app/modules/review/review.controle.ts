import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { ReviewSrevice } from "./review.service";
import { SendResponse } from "../../utils/sendResponse";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const decodedToken = req.user as JwtPayload;

    const result = await ReviewSrevice.createReview(payload, decodedToken);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review created successfully",
      data: result.data,
    });
  }
);

const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;

    const result = await ReviewSrevice.getAllReviews(query);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All reviews retrive successfully",
      data: result.data,
    });
  }
);

const getMyReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const decodedToken = req.user as JwtPayload;

    const result = await ReviewSrevice.getMyReviews(query, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All reviews retrive successfully",
      data: result.data,
    });
  }
);
const getWriterReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const decodedToken = req.user as JwtPayload;

    const result = await ReviewSrevice.getWriterReviews(query, decodedToken);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All reviews retrive successfully",
      data: result.data,
    });
  }
);

export const ReviewControlers = {
  createReview,
  getAllReviews,
  getMyReviews,
  getWriterReviews,
};
