import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";

import config from "../config";

import loggerWithNameSpace from "../utils/logger.utils";
import { UnauthenticatedError } from "../errors/error.error";

import { IUser } from "../interface/user.interface";
import { AuthRequest } from "../interface/auth.interface";

const logger = loggerWithNameSpace("Auth Middleware: ");

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UnauthenticatedError("Access token required");
  }

  const token = authorization.split(" ");
  if (token.length !== 2 || token[0] !== "Bearer") {
     throw new UnauthenticatedError("Invalid access token");
  }
  try {
    const payload = jwt.verify(
      token[1],
      config.jwt.access_token_secret!
    ) as IUser;
    req.user = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch (error) {
    logger.error(error);
    throw new UnauthenticatedError("Invalid access token");
  }
};
