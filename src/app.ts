import config from "config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandler } from "./common/middlewares/global.error.handler";
import router from "./router";

const app = express();

app.use(
  cors({
    origin: [
      config.get("frontend.dashboard_url"),
      config.get("frontend.client_url"),
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from order service service!" });
});

app.use(router);

app.use(globalErrorHandler);

export default app;
