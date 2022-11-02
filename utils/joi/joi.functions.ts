import * as Joi from "joi";
import { Request } from "express";
import { wrapValidator } from "../helpers/wrapper";
import { PermissionError } from "../errors/generalError";
import { IPermissionSchema } from "./permissionSchema.interface";
import { Global } from "../../enums/helpers/Global";

const contextService = require("request-context");

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
  options: Joi.ValidationOptions = defaultValidationOptions,
  doesWrap = true
): any => {
  const validator = async (req: Request): Promise<void> => {
    const value = await schema.unknown().validateAsync(req, options);
    if (options.convert) {
      normalizeRequest(req, value);
    }
  };

  return doesWrap ? wrapValidator(validator) : validator;
};

export const validateRequestByPermission = (
  allValidations: IPermissionSchema[],
  options: Joi.ValidationOptions = defaultValidationOptions
) => {
  const validator = async (req: Request): Promise<void> => {
    const wantedValidation = allValidations.find((validation) =>
      validation.permissions.includes(contextService.get(Global.PERMISSION))
    );
    if (!wantedValidation) {
      throw new PermissionError();
    }
    await validateRequest(wantedValidation.schema, options, false)(req);
  };
  return wrapValidator(validator);
};
