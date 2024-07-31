import { Schema } from "joi";
import { BadRequestError } from "../errors/error.error";
import { NextFunction, Request, Response } from "express";

export function validateReqQuery(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);
    if (error) throw (new BadRequestError(error.message));
    req.query = value;
    next();
  };
}

export function validateReqParams(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params);
    if (error) throw (new BadRequestError(error.message));
    req.params = value;
    next();
  };
}

export function validateReqBody(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) throw (new BadRequestError(error.message));
    req.body = value;
    next();
  };
}
