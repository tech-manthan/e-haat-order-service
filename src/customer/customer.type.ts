import { Request } from "express";

export interface Address {
  text: string;
  isDefault: boolean;
}

export interface Customer {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  tenants: string[];
  isBanned?: boolean;
}

export interface GetCustomerRequest extends Request {
  body: {
    tenantId: string;
  };
}

export interface AddAddressRequest extends Request {
  body: {
    text: string;
    isDefault?: boolean;
  };
}

export interface CustomerFilters {
  tenantId?: number | undefined;
  isBanned?: boolean | undefined;
}

export interface CustomerValidFilters extends CustomerFilters {
  q: string;
  currentPage: number;
  perPage: number;
}
