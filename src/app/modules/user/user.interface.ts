import { Types } from "mongoose";
import { Subscription_Type } from "../payment/payment.interface";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  WRITER = "WRITER",
  USER = "USER",
}

export enum RoleStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IRoleChange {
  userId: Types.ObjectId;
  currentRole: Role;
  requestedRole: Role;
  status: RoleStatus;
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVarified?: boolean;
  role: Role;
  auth: IAuthProvider[];
  subscribe: boolean;
  subscriptionType: Subscription_Type | null;
  subscriptionDate: Date | string | null;
  subscriptionExpires: Date | string | null;
  createdAt?: Date;
}
