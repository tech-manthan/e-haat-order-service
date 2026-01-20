import { Request, Response } from "express";
import CustomerService from "./customer.service";
import { Logger } from "winston";
import { AuthRequest, IdParams } from "../common/types";
import {
  AddAddressRequest,
  CustomerValidFilters,
  GetCustomerRequest,
} from "./customer.type";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";

export default class CustomerController {
  constructor(
    private customerService: CustomerService,
    private logger: Logger,
  ) {
    this.getCustomer = this.getCustomer.bind(this);
    this.getAllCustomers = this.getAllCustomers.bind(this);
    this.addAddress = this.addAddress.bind(this);
  }

  async getCustomer(req: GetCustomerRequest, res: Response) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw createHttpError(400, result.array().at(0)?.msg as string);
    }

    const { email, firstName, id, lastName } = (req as AuthRequest).auth;
    const { tenantId } = req.body;

    const customer = await this.customerService.get(id);

    if (!customer) {
      const newCustomer = await this.customerService.create({
        userId: id,
        email,
        firstName,
        lastName,
        tenants: [tenantId],
        addresses: [],
      });

      this.logger.info("Customer Created & returned successfully", {
        userId: id,
      });
      return res.json(newCustomer);
    }

    if (!customer.tenants.includes(tenantId)) {
      const updatedCustomer = await this.customerService.addTenant({
        userId: id,
        tenantId: tenantId,
      });

      this.logger.info("Customer Updated & returned successfully", {
        userId: id,
      });

      return res.json(updatedCustomer);
    }

    this.logger.info("Customer fetched successfully", {
      userId: id,
    });
    res.json(customer);
  }

  async addAddress(req: AddAddressRequest, res: Response) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw createHttpError(400, result.array().at(0)?.msg as string);
    }

    const { id } = matchedData<IdParams>(req, {
      onlyValidData: true,
    });

    const { text, isDefault } = req.body;

    const updatedCustomer = await this.customerService.addAddress({
      customerId: id,
      address: {
        text,
        isDefault: isDefault ? isDefault : false,
      },
    });
    this.logger.info("address added successfully");

    return res.json(updatedCustomer);
  }

  async getAllCustomers(req: Request, res: Response) {
    const err = createHttpError(404, "Hello");
    throw err;
    const { currentPage, perPage, q, tenantId, isBanned } =
      matchedData<CustomerValidFilters>(req, {
        onlyValidData: true,
      });

    const { docs, totalDocs, page, limit } =
      await this.customerService.getCustomers(
        q,
        {
          tenantId,
          isBanned,
        },
        {
          page: currentPage,
          limit: perPage,
        },
      );

    res.json({
      data: docs,
      total: totalDocs,
      currentPage: page,
      perPage: limit,
    });
  }
}
