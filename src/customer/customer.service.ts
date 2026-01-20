import mongoose, {
  AggregatePaginateModel,
  AggregatePaginateResult,
} from "mongoose";
import { Address, Customer, CustomerFilters } from "./customer.type";
import { PaginateQuery } from "../common/types";

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

  async addAddress({
    customerId,
    address,
  }: {
    customerId: mongoose.Types.ObjectId;
    address: Address;
  }) {
    const updatedCustomer = await this.customerRepository.findOneAndUpdate(
      { _id: customerId },
      { $addToSet: { addresses: address } },
      { new: true },
    );

    if (!updatedCustomer) {
      throw new Error(`Customer with customeId ${customerId} not found`);
    }

    return updatedCustomer;
  }

  async getCustomers(
    q: string,
    { tenantId, isBanned }: CustomerFilters,
    paginateQuery: PaginateQuery,
  ): Promise<AggregatePaginateResult<Customer>> {
    const searchQueryRegexp = new RegExp(q, "i");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};

    if (tenantId !== undefined && tenantId !== null)
      filters.tenantId = tenantId;

    if (isBanned !== undefined) {
      filters.isBanned = isBanned;
    }

    const aggregate = this.customerRepository.aggregate([
      {
        $match: {
          ...filters,
          $or: [
            { firstName: searchQueryRegexp },
            { lastName: searchQueryRegexp },
            { email: searchQueryRegexp },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return this.customerRepository.aggregatePaginate<Customer>(aggregate, {
      ...paginateQuery,
    });
  }
}
