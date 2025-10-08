import { Request } from "express-jwt";
import mongoose from "mongoose";

export type AuthCookie = {
  accessToken: string;
};

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
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
