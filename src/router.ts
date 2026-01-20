import { Router } from "express";
import { customerRouter } from "./customer";
import { couponRouter } from "./coupon";

const router = Router();

router.use("/customers", customerRouter);
router.use("/coupons", couponRouter);

export default router;
