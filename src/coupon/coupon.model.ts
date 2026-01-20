import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { AggregatePaginateModel, model, Schema } from "mongoose";
import { Coupon } from "./coupon.type";

const couponSchema = new Schema<Coupon>(
  {
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    tenantId: {
      type: Number,
      required: true,
    },
    validity: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

couponSchema.plugin(aggregatePaginate);
export const CouponModel = model<Coupon, AggregatePaginateModel<Coupon>>(
  "Coupon",
  couponSchema,
);
