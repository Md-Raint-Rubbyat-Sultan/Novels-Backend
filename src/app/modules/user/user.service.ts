import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/appError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constants";
import {
  IAuthProvider,
  IRoleChange,
  IUser,
  Role,
  RoleStatus,
} from "./user.interface";
import { RoleChange, User } from "./user.model";
import { redisClint } from "../../config/redis.confg";

const createUser = async (payload: Partial<IUser>) => {
  const { email, ...rest } = payload;

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    ...rest,
    email,
    auth: [authProvider],
  });

  return { data: user };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.USER || decodedToken.role === Role.WRITER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(403, "You are forbidden to update this user.");
    }
  }

  const session = await User.startSession();
  session.startTransaction();

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(404, "User do not exist.");
  }

  if (
    decodedToken.role === Role.ADMIN &&
    isUserExist.role === Role.SUPER_ADMIN
  ) {
    throw new AppError(403, "You are forbidden to update this role.");
  }

  if (payload.isActive || payload.isDeleted || payload.isVarified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.WRITER) {
      throw new AppError(403, "You are forbidden to update this fields.");
    }
  }

  if (!payload.picture) {
    const { picture, ...rest } = payload;
    payload = rest;
  }

  try {
    const newUpdatedUser = await User.findOneAndUpdate(
      { _id: userId },
      payload,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (payload.picture && isUserExist.picture) {
      await deleteImageFromCloudinary(isUserExist.picture);
    }

    await session.commitTransaction();
    session.endSession();

    return { data: newUpdatedUser };
  } catch (error: any) {
    // some error occur do not implement anything to the real data base
    await session.abortTransaction(); // rollback
    session.endSession();
    throw new AppError(400, `Faild to update user. ${error.message}`);
  }
};

const getAllUser = async (query: Record<string, string>) => {
  const queryElement = new QueryBuilder(User.find(), query);

  const users = queryElement
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    (await users).build(),
    queryElement.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getMe = async (_id: string) => {
  const user = await User.findById(_id).select("-password");

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    const redisSubsrciptionKey = `subscription:${user?.email}`;

    const result = await redisClint.get(redisSubsrciptionKey);

    const parsedResult = result ? JSON.parse(result) : { subscribe: false };

    if (!parsedResult.subscribe) {
      (user.subscribe = false), (user.subscriptionType = null);
      user.save();
    }
  }

  return {
    data: user,
  };
};

const getSingleUser = async (_id: string) => {
  const user = await User.findById(_id);
  return {
    data: user,
  };
};

const getAdmins = async () => {
  const user = await User.find({
    role: { $in: [Role.ADMIN, Role.SUPER_ADMIN] },
  }).select("-password");

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return {
    data: user,
  };
};

const getAllRoleChangeRequest = async (query: Record<string, string>) => {
  const queryModel = new QueryBuilder(RoleChange.find(), query);
  const requsetedChanges = queryModel.filter().sort().paginate();

  const [data, meta] = await Promise.all([
    (await requsetedChanges).build().populate("userId", "-password"),
    queryModel.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const RoleChangeRequest = async (
  payload: { reqRole: string },
  decodedToken: JwtPayload
) => {
  const isRoleRequestExist = await RoleChange.find({
    userId: decodedToken.userId,
  });

  if (
    isRoleRequestExist.some((status) => status.status === RoleStatus.PENDING)
  ) {
    throw new AppError(400, "Your previous request pending.");
  }

  if (payload.reqRole === Role.ADMIN && decodedToken.role === Role.ADMIN) {
    throw new AppError(400, "You are already an Admin");
  }

  if (
    (payload.reqRole === Role.USER || payload.reqRole === Role.WRITER) &&
    (decodedToken.role === Role.WRITER || decodedToken.role === Role.ADMIN)
  ) {
    throw new AppError(400, "Writer or Admin can't ba Writer or User again.");
  }

  const changeRequestPayload: IRoleChange = {
    userId: decodedToken.userId,
    currentRole: decodedToken.role,
    requestedRole: payload.reqRole as Role,
    status: RoleStatus.PENDING,
  };

  const changedRoleRequest = await RoleChange.create(changeRequestPayload);

  return {
    data: changedRoleRequest,
  };
};

const updateRole = async (_id: string, payload: string) => {
  if (
    ![RoleStatus.ACCEPTED, RoleStatus.CANCELED].includes(payload as RoleStatus)
  ) {
    throw new AppError(
      400,
      `Request miss matched. Request should be either ${RoleStatus.ACCEPTED} or ${RoleStatus.CANCELED}`
    );
  }

  const session = await RoleChange.startSession();
  session.startTransaction();

  try {
    const updatedRole = await RoleChange.findByIdAndUpdate(
      _id,
      {
        status: payload,
      },
      { new: true, runValidators: true, session }
    );

    if (!updatedRole) {
      throw new AppError(400, "Faild to updated user Role.");
    }

    if (updatedRole.status === RoleStatus.ACCEPTED) {
      const newUser = await User.findByIdAndUpdate(
        updatedRole.userId,
        {
          role: updatedRole.requestedRole,
        },
        { new: true, runValidators: true, session }
      ).select("-password");

      if (!newUser) {
        throw new AppError(400, "Failed to create token. User not found.");
      }

      await session.commitTransaction();
      session.endSession();
      return {
        data: "Role Update successful",
      };
    }

    if (updatedRole.status === RoleStatus.CANCELED) {
      await session.commitTransaction();
      session.endSession();
      return { data: "Role update request rejected by admin" };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.log(error);

    throw new AppError(400, "Faild to update role.");
  }
};

const requestRoleStats = async () => {
  const pendingRequestPromise = RoleChange.find({
    status: RoleStatus.PENDING,
  }).countDocuments();
  const acceptRequestPromise = RoleChange.find({
    status: RoleStatus.ACCEPTED,
  }).countDocuments();
  const cancleRequestPromise = RoleChange.find({
    status: RoleStatus.CANCELED,
  }).countDocuments();

  const [pendingRequest, acceptRequest, cancleRequest] = await Promise.all([
    pendingRequestPromise,
    acceptRequestPromise,
    cancleRequestPromise,
  ]);

  return {
    data: {
      pendingRequest,
      acceptRequest,
      cancleRequest,
    },
  };
};

export const UserServices = {
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
