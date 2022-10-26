/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as Joi from "joi";
import { Request } from "express";
import { wrapValidator } from "../helpers/wrapper";
import { PermissionError } from "../errors/generalError";

export const defaultValidationOptions: Joi.ValidationOptions = {
  abortEarly: false,
  allowUnknown: false,
  convert: true,
};

const normalizeRequest = (req: any, value: any): void => {
  req.originalBody = req.body;
  req.body = value.body;

  req.originalQuery = req.query;
  req.query = value.query;

  req.originalParams = req.params;
  req.params = value.params;
};

export const validateRequest = (
  schema: Joi.ObjectSchema<any>,
  options: Joi.ValidationOptions = defaultValidationOptions
) => {
  const validator = async (req: Request): Promise<void> => {
    const { error, value } = schema.unknown().validate(req, options);
    if (error) {
      throw error;
    }

    if (options.convert) {
      normalizeRequest(req, value);
    }
  };

  return wrapValidator(validator);
};

export const validateRequestByPermission = (
  allValidations: {
    permissions: Permissions[];
    schema: Joi.ObjectSchema<any>;
  }[]
) => {
  const wantedValidation = allValidations.find((validation) =>
    validation.permissions.includes((<any>global).permission)
  );
  if (wantedValidation) {
    return validateRequest(wantedValidation.schema);
  }
  throw new PermissionError();
};
