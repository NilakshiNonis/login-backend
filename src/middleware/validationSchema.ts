import { Response, Request, NextFunction } from "express";
import Joi from "joi";
import OperationResult from "../utils/operationResult";

type KeyValidateType = "body" | "query" | "params";

class ValidateSchema {
  static prepare(
    schema: Joi.ObjectSchema<any>,
    keyValidate: KeyValidateType = "body"
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error } = schema.validate(req.body);
        if (error)
          return res.status(422).jsonp(OperationResult.failed(422, error.message));
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

export default ValidateSchema;
