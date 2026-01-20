import { Request } from "express";

export interface Coupon {
  title: string;
  code: string;
  discount: number;
  validity: Date;
  tenantId: number;
}

export interface CreateCouponData {
  title: string;
  code: string;
  discount: number;
  validity: Date;
  tenantId: number;
}

export interface UpdateCouponData {
  title: string | undefined;
  code: string | undefined;
  discount: number | undefined;
  validity: Date | undefined;
  tenantId: number;
}

export interface CreateCouponRequest extends Request {
  body: CreateCouponData;
}

export interface UpdateCouponRequest extends Request {
  body: UpdateCouponData;
}

export interface CouponFilters {
  tenantId?: number | undefined;
  from?: Date | undefined;
  to?: Date | undefined;
}

export interface CouponValidFilters extends CouponFilters {
  q: string;
  currentPage: number;
  perPage: number;
}

export interface ValidateCoupon {
  code: string;
}

export interface ValidateCouponRequest extends Request {
  body: ValidateCoupon;
}
