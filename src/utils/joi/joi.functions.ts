import { Permission } from "common-atom/enums/Permission";
import { Global } from "common-atom/enums/helpers/Global";
import { Request } from "express";
import { ObjectSchema, ValidationOptions } from "joi";
import { throwUnauthorizedError } from "../errors/applicationError";
import { getContext } from "../helpers/context";
import { wrapValidator } from "../helpers/wrapper";

export const defaultValidationOptions: ValidationOptions = {
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

// joi validation for noraml schemas
export const validateRequest = (
  schema: ObjectSchema,
  options: ValidationOptions = defaultValidationOptions,
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

// joi validation for schemas that changes according to the permission of the user
export const validateRequestByPermission = (
  allValidations: {
    permissions: Permission[];
    schema: ObjectSchema<any>;
  }[],
  options: ValidationOptions = defaultValidationOptions
) => {
  const validator = async (req: Request): Promise<void> => {
    const wantedValidation = allValidations.find((validation) =>
      validation.permissions.includes(getContext(Global.USER).permission)
    );

    wantedValidation
      ? await validateRequest(wantedValidation.schema, options, false)(req)
      : throwUnauthorizedError("Invalid Permission");
  };
  return wrapValidator(validator);
};
