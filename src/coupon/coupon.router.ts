import { Router } from "express";
import CouponService from "./coupon.service";
import { CouponModel } from "./coupon.model";
import CouponController from "./coupon.controller";
import logger from "../utils/logger";
import authenticate from "../common/middlewares/authenticate";
import canAccess from "../common/middlewares/can.access";
import { UserRole } from "../common/types";
import idValidator from "../common/validators/id.validator";
import getAllCouponValidator from "./validators/get.all.coupon.validator";
import createCouponValidator from "./validators/create.coupon.validator";
import validateCouponValidator from "./validators/validate.coupon.validator";
import updateCouponValidator from "./validators/update.coupon.validator";
import { asyncWrapper } from "../utils/async-wrapper";

const router = Router();

const couponService = new CouponService(CouponModel);
const couponController = new CouponController(couponService, logger);

router.delete(
  "/:id",
  authenticate,
  canAccess([UserRole.ADMIN, UserRole.MANAGER]),
  idValidator("Coupon"),
  asyncWrapper(couponController.delete),
);

router.get(
  "/",
  authenticate,
  canAccess([UserRole.ADMIN, UserRole.MANAGER]),
  getAllCouponValidator,
  asyncWrapper(couponController.getAll),
);

router.get(
  "/:id",
  authenticate,
  canAccess([UserRole.ADMIN, UserRole.MANAGER]),
  idValidator("Coupon"),
  asyncWrapper(couponController.getOne),
);

router.post(
  "/validate",
  validateCouponValidator,
  couponController.validateCoupon,
);

router.post(
  "/",
  authenticate,
  canAccess([UserRole.ADMIN, UserRole.MANAGER]),
  createCouponValidator,
  asyncWrapper(couponController.create),
);

router.patch(
  "/:id",
  authenticate,
  canAccess([UserRole.ADMIN, UserRole.MANAGER]),
  idValidator("Coupon"),
  updateCouponValidator,
  asyncWrapper(couponController.update),
);

export default router;
