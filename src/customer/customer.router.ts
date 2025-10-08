import { Router } from "express";
import { asyncWrapper } from "../utils/async-wrapper";
import CustomerController from "./customer.controller";
import CustomerService from "./customer.service";
import logger from "../utils/logger";
import authenticate from "../common/middlewares/authenticate";
import getCustomerValidator from "./validators/get.customer.validator";
import { CustomerModel } from "./customer.model";
import idValidator from "../common/validators/id.validator";
import addAddressValidator from "./validators/add.address.validator";

const customerRouter = Router();

const customerService = new CustomerService(CustomerModel);
const customerController = new CustomerController(customerService, logger);

// Client Endpoint for getting & creating & update(tenants) customer
customerRouter.get(
  "/",
  authenticate,
  getCustomerValidator,
  asyncWrapper(customerController.getCustomer),
);

customerRouter.patch(
  "/addresses/:id",
  authenticate,
  idValidator("Customer"),
  addAddressValidator,
  asyncWrapper(customerController.addAddress),
);

export default customerRouter;
