import { NextFunction, Response } from "express";
import { ForbiddenError } from "../errors/error.error";
import { AuthRequest } from "../interface/auth.interface";

export const authorize = (action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const { role } = req.user;
    console.log(role);
    if (action !== role) {
      return next(new ForbiddenError("Forbidden access,You are not authorized to perform this action"));
    }
    next();
  };
};
