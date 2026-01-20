import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError, { HttpError } from "http-errors";

export const asyncWrapper = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      if (err instanceof HttpError) {
        return next(
          createHttpError(err.statusCode || err.status || 500, err.message),
        );
      }
      return next(createHttpError(500, "Internal server error"));
    });
  };
};
