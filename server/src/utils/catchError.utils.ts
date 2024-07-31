import { NextFunction } from "express-serve-static-core";
import { Request, RequestHandler, Response } from "express";

export const catchAsyncError = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(error=> next(error));
  };
};
