import { CallbackWithoutResultAndOptionalError, model, Schema } from "mongoose";
import {
  IAuthProvider,
  IRoleChange,
  IsActive,
  IUser,
  Role,
  RoleStatus,
} from "./user.interface";
import AppError from "../../errorHelpers/appError";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { Subscription_Type } from "../payment/payment.interface";

const RoleChangeSchema = new Schema<IRoleChange>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    currentRole: { type: String, enum: Role, required: true },
    requestedRole: { type: String, enum: Role, required: true },
    status: { type: String, enum: RoleStatus, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const RoleChange = model<IRoleChange>("RoleChange", RoleChangeSchema);

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { versionKey: false, _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String, default: "N/A" },
    picture: { type: String, default: null },
    address: { type: String, default: "N/A" },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVarified: { type: Boolean, default: true },
    auth: [authProviderSchema],
    subscribe: {
      type: Boolean,
      default: false,
    },
    subscriptionType: {
      type: String,
      enum: Object.values(Subscription_Type),
      default: null,
    },
    subscriptionDate: {
      type: Date,
      default: null,
    },
    subscriptionExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    try {
      if (this.password) {
        if (this.isModified("password") || this.isNew) {
          this.password = await bcrypt.hash(
            this.password as string,
            Number(envVars.BCRYPT_SALT)
          );
        }
      }
      next();
    } catch (error) {
      throw new AppError(500, "Failed to hash password.");
    }
  }
);

export const User = model<IUser>("User", userSchema);
