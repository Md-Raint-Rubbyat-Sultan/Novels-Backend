import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { StatsServices } from "./stats.service";

const userStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsServices.userStats();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User stats retrive successfully.",
      data: result.data,
    });
  }
);

const paymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsServices.paymentStats();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "payment stats retrive successfully.",
      data: result.data,
    });
  }
);

const popularBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsServices.popularBooks();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Books stats retrive successfully.",
      data: result.data,
    });
  }
);

const popularWriters = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await StatsServices.popularWriters();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Writers stats retrive successfully.",
      data: result.data,
    });
  }
);

export const StatsControllers = {
  userStats,
  paymentStats,
  popularBooks,
  popularWriters,
};
