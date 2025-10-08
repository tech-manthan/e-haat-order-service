import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose, { AggregatePaginateModel, model } from "mongoose";
import { Address, Customer } from "./customer.type";

const addressSchema = new mongoose.Schema<Address>(
  {
    text: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const customerSchema = new mongoose.Schema<Customer>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    addresses: {
      type: [addressSchema],
      required: false,
    },
    tenants: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

customerSchema.plugin(aggregatePaginate);
export const CustomerModel = model<Customer, AggregatePaginateModel<Customer>>(
  "Customer",
  customerSchema,
);
