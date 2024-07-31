import HttpStatusCodes from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
  BadRequestError,
  InternalServerError,
  UnauthenticatedError,
} from "../errors/error.error";
import loggerWithNameSpace from "../utils/logger.utils";


export function notFoundError(req: Request, res: Response) {
  return res.status(HttpStatusCodes.NOT_FOUND).json({
    message: "Route/Path not found",
    success: false
  });
}

export function genericErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const logger = loggerWithNameSpace("Error");
  logger.error(error);
  if (error instanceof UnauthenticatedError) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: error.message,
    });
  }

  if (error instanceof BadRequestError) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({
      message: error.message,
    });
  }

  if (error instanceof ForbiddenError) {
    return res.status(HttpStatusCodes.FORBIDDEN).json({
      message: error.message,
    });
  }

  if (error instanceof InternalServerError) {
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }

  if (error instanceof ConflictError) {
    return res.status(HttpStatusCodes.CONFLICT).json({
      message: error.message,
    });
  }

  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
  });
}
