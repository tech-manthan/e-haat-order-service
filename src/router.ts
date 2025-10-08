import { Router } from "express";
import { customerRouter } from "./customer";

const router = Router();

router.use("/customer", customerRouter);

export default router;
