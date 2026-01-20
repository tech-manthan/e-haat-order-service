import { Logger } from "winston";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";
import { AuthRequest, IdParams, UserRole } from "../common/types";
import CouponService from "./coupon.service";
import {
  CouponValidFilters,
  CreateCouponRequest,
  UpdateCouponRequest,
  ValidateCouponRequest,
} from "./coupon.type";

export default class CouponController {
  constructor(
    private couponService: CouponService,
    private logger: Logger,
  ) {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
  }

  async create(req: CreateCouponRequest, res: Response) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw createHttpError(400, result.array().at(0)?.msg as string);
    }

    const { code, discount, tenantId, title, validity } = req.body;

    const coupon = await this.couponService.create({
      code,
      discount,
      tenantId,
      title,
      validity,
    });

    this.logger.info("coupon created successfully", {
      id: coupon._id,
    });

    return res.status(201).json({
      id: coupon._id,
    });
  }

  async update(req: UpdateCouponRequest, res: Response) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw createHttpError(400, result.array().at(0)?.msg as string);
    }

    const { id } = matchedData<IdParams>(req, {
      onlyValidData: true,
    });

    const existingCoupon = await this.couponService.getCoupon(id);

    if (!existingCoupon) {
      throw createHttpError(404, "coupon not found");
    }

    if ((req as AuthRequest).auth.role === UserRole.MANAGER) {
      if (
        existingCoupon.tenantId !== Number((req as AuthRequest).auth.tenant)
      ) {
        throw createHttpError(403, "You are not allowed to access this coupon");
      }
    }

    const { code, discount, tenantId, title, validity } = req.body || {};

    const coupon = await this.couponService.update(id, {
      code,
      discount,
      tenantId,
      title,
      validity,
    });

    if (!coupon) {
      throw createHttpError(500, "failed to update coupon");
    }

    this.logger.info("coupon updated successfully", {
      id: coupon._id,
    });

    res.status(200).json({
      id: coupon._id,
    });
  }

  async getAll(req: Request, res: Response) {
    const { currentPage, perPage, q, from, tenantId, to } =
      matchedData<CouponValidFilters>(req, {
        onlyValidData: true,
      });

    const { docs, totalDocs, page, limit } =
      await this.couponService.getCoupons(
        q,
        {
          from,
          to,
          tenantId,
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

  async getOne(req: Request, res: Response) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw createHttpError(400, result.array().at(0)?.msg as string);
    }

    const { id } = matchedData<IdParams>(req, {
      onlyValidData: true,
    });

    const coupon = await this.couponService.getCoupon(id);

    if (!coupon) {
      throw createHttpError(404, "coupon not found");
    }

    return res.json(coupon);
  }

  async delete(req: Request, res: Response) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw createHttpError(400, result.array().at(0)?.msg as string);
    }

    const { id } = matchedData<IdParams>(req, {
      onlyValidData: true,
    });

    const existingCoupon = await this.couponService.getCoupon(id);

    if (!existingCoupon) {
      throw createHttpError(404, "coupon not found");
    }

    if ((req as AuthRequest).auth.role === UserRole.MANAGER) {
      if (
        existingCoupon.tenantId !== Number((req as AuthRequest).auth.tenant)
      ) {
        throw createHttpError(403, "You are not allowed to delete this coupon");
      }
    }

    const { deletedCount, acknowledged } =
      await this.couponService.deleteCoupon(id);

    if (!acknowledged || deletedCount !== 1) {
      throw createHttpError(404, "coupon not deleted, some error try again");
    }

    return res.json({
      id: id,
    });
  }

  async validateCoupon(req: ValidateCouponRequest, res: Response) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw createHttpError(400, result.array().at(0)?.msg as string);
    }

    const { code } = req.body;

    const coupon = await this.couponService.findCouponByCode({
      code: code,
    });

    if (!coupon) {
      throw createHttpError(404, "invalid coupon");
    }

    const now = new Date();
    const validityDate = new Date(coupon.validity);

    if (validityDate < now) {
      throw createHttpError(400, "Coupon has expired");
    }

    return res.status(200).json({
      success: true,
      message: "Coupon is valid",
      coupon,
    });
  }
}
