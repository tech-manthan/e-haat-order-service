import { Request } from "express-jwt";
import mongoose from "mongoose";

export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
  MANAGER = "manager",
}

export type AuthCookie = {
  accessToken: string;
};

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: UserRole;
    id: string;
    tenant: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface IdParams {
  id: mongoose.Types.ObjectId;
}

export interface PaginateQuery {
  page: number;
  limit: number;
}
