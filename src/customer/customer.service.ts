import { AggregatePaginateModel } from "mongoose";
import { Customer } from "./customer.type";

export default class CustomerService {
  constructor(private customerRepository: AggregatePaginateModel<Customer>) {}

  async create({
    addresses,
    email,
    firstName,
    lastName,
    tenants,
    userId,
  }: Customer) {
    return this.customerRepository.create({
      userId,
      firstName,
      lastName,
      email,
      addresses,
      tenants,
    });
  }

  async get(userId: string) {
    return this.customerRepository.findOne({
      userId: userId,
    });
  }

  async addTenant({ tenantId, userId }: { userId: string; tenantId: string }) {
    const updatedCustomer = await this.customerRepository.findOneAndUpdate(
      { userId },
      { $addToSet: { tenants: tenantId } }, // prevents duplicates
      { new: true }, // returns updated doc
    );

    if (!updatedCustomer) {
      throw new Error(`Customer with userId ${userId} not found`);
    }

    return updatedCustomer;
  }
}
