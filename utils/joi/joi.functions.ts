/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as Joi from "joi";
import { Request } from "express";
import { wrapValidator } from "../helpers/wrapper";
import { PermissionError } from "../errors/generalError";
import { IPermissionSchema } from "./permissionSchema.interface";
import { Permission } from "../../enums/Permission";

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
    const { error, value } = schema.unknown().validate(req, options);
    if (error) {
      throw error;
    }

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
      [Permission.ADMIN, ...validation.permissions].includes(
        (<any>global).permission
      )
    );
    if (wantedValidation) {
      await validateRequest(wantedValidation.schema, options, false)(req);
    } else {
      throw new PermissionError();
    }
  };
  return wrapValidator(validator);
};
