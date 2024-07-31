import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";

import config from "../config";

import loggerWithNameSpace from "../utils/logger.utils";
import { UnauthenticatedError } from "../errors/error.error";

import { AuthRequest } from "../interface/auth.interface";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { getUserById } from "../services/users.service";
import { IPayload } from "../interface/payload.interface";

const logger = loggerWithNameSpace("Auth Middleware: ");

export const verifyUser = async(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(new UnauthenticatedError("Access token required"));
    return;
  }
  const token = authorization.split(" ");
  if (token.length !== 2 || token[0] !== "Bearer") {
    next(new UnauthenticatedError("Invalid access token"));
    return;
  }
  try {
    const playload = jwt.verify(token[1], config.jwt.access_token_secret!) as IPayload;
    const user  =  await getUserById(playload.id)
    res.status(200).json(new ApiResponse("Verified", user));
  } catch (error) {
    logger.error(error);
    next(new UnauthenticatedError("Invalid access token"));
    return;
  }
};
