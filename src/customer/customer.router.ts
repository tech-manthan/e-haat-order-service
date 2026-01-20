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
import canAccess from "../common/middlewares/can.access";
import { UserRole } from "../common/types";
import getAllCustomerValidator from "./validators/get.all.customer.validator";

const customerRouter = Router();

const customerService = new CustomerService(CustomerModel);
const customerController = new CustomerController(customerService, logger);

// Client Endpoint for getting & creating & update(tenants) customer
customerRouter.get(
  "/",
  authenticate,
  canAccess([UserRole.CUSTOMER]),
  getCustomerValidator,
  asyncWrapper(customerController.getCustomer),
);

customerRouter.patch(
  "/addresses/:id",
  authenticate,
  canAccess([UserRole.CUSTOMER]),
  idValidator("Customer"),
  addAddressValidator,
  asyncWrapper(customerController.addAddress),
);

customerRouter.get(
  "/all",
  authenticate,
  canAccess([UserRole.ADMIN, UserRole.MANAGER]),
  getAllCustomerValidator,
  asyncWrapper(customerController.getAllCustomers),
);
export default customerRouter;
