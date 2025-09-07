import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/createUserToken";
import { setAuthCookies } from "../../utils/setCookies";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userInfo = {
      ...req.body,
      picture: req.file?.path || "",
    };

    const result = await UserServices.createUser(userInfo);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: result.data,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = {
      ...req.body,
      picture: req.file?.path,
    };
    const verifiedToken = req.user;

    const result = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: result.data,
    });
  }
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserServices.getAllUser(
      query as Record<string, string>
    );

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrive successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;
    const result = await UserServices.getMe(userId);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrive successfully",
      data: result.data,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const result = await UserServices.getSingleUser(_id);

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrive successfully",
      data: result.data,
    });
  }
);

const getAdmins = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAdmins();

    SendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrived successfully.",
      data: result.data,
    });
  }
);

const getAllRoleChangeRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserServices.getAllRoleChangeRequest(
      query as Record<string, string>
    );

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Changed role retrived successfully.",
      data: result.data,
      meta: result.meta,
    });
  }
);

const RoleChangeRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const payload = req.body;
    const result = await UserServices.RoleChangeRequest(payload, decodedToken);

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Requset change role successfully.",
      data: result.data,
    });
  }
);

const updateRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const { isAccepted } = req.body;
    const result = await UserServices.updateRole(_id, isAccepted);

    if (result?.data) {
      if (typeof result.data !== "string") {
        const newUserToken = createUserToken(result.data);
        setAuthCookies(res, newUserToken);
      }
    }

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Role update",
      data: result?.data,
    });
  }
);

const requestRoleStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.requestRoleStats();

    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Role Stats.",
      data: result.data,
    });
  }
);

export const UserControllers = {
  createUser,
  updateUser,
  getAllUser,
  getMe,
  getSingleUser,
  getAdmins,
  getAllRoleChangeRequest,
  RoleChangeRequest,
  updateRole,
  requestRoleStats,
};
