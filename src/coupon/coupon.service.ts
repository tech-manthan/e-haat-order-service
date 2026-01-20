import mongoose, {
  AggregatePaginateModel,
  AggregatePaginateResult,
} from "mongoose";
import { PaginateQuery } from "../common/types";
import {
  Coupon,
  CouponFilters,
  CreateCouponData,
  UpdateCouponData,
  ValidateCoupon,
} from "./coupon.type";

export default class CouponService {
  constructor(private couponRepository: AggregatePaginateModel<Coupon>) {}

  async create({
    code,
    discount,
    tenantId,
    title,
    validity,
  }: CreateCouponData) {
    return this.couponRepository.create({
      code,
      discount,
      tenantId,
      title,
      validity,
    });
  }

  async update(
    id: mongoose.Types.ObjectId,
    { code, discount, tenantId, title, validity }: UpdateCouponData,
  ) {
    const updatedData: Partial<Coupon> = {};

    if (title !== undefined) {
      updatedData.title = title;
    }
    if (discount !== undefined) {
      updatedData.discount = discount;
    }
    if (code !== undefined) {
      updatedData.code = code;
    }
    if (validity !== undefined) {
      updatedData.validity = validity;
    }
    if (tenantId !== undefined) {
      updatedData.tenantId = tenantId;
    }

    return this.couponRepository.findByIdAndUpdate(
      id,
      {
        $set: updatedData,
      },
      { new: true },
    );
  }

  async getCoupon(id: mongoose.Types.ObjectId) {
    return this.couponRepository.findById(id);
  }

  async getCoupons(
    q: string,
    { tenantId, from, to }: CouponFilters,
    paginateQuery: PaginateQuery,
  ): Promise<AggregatePaginateResult<Coupon>> {
    const searchQueryRegexp = new RegExp(q, "i");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};

    if (tenantId !== undefined && tenantId !== null)
      filters.tenantId = tenantId;

    if (from && to) {
      filters.validity = {};
      if (from) filters.validity.$gte = new Date(from);
      if (to) filters.validity.$lte = new Date(to);
    }

    const aggregate = this.couponRepository.aggregate([
      {
        $match: {
          ...filters,
          $or: [{ title: searchQueryRegexp }, { code: searchQueryRegexp }],
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return this.couponRepository.aggregatePaginate<Coupon>(aggregate, {
      ...paginateQuery,
    });
  }

  async deleteCoupon(id: mongoose.Types.ObjectId) {
    return this.couponRepository.deleteOne({ _id: id });
  }

  async findCouponByCode({ code }: ValidateCoupon) {
    return this.couponRepository.findOne({
      code: code,
    });
  }
}
