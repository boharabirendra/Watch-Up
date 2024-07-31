import { NextFunction, Request, Response } from "express";

import loggerWithNameSpace from "../utils/logger.utils";

const logger = loggerWithNameSpace("RequestLogger");

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method}: ${req.url}`);
  next();
}