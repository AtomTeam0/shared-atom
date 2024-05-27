import { Permission } from "common-atom/enums/Permission";
import { Global } from "common-atom/enums/helpers/Global";
import { Request } from "express";
import { ObjectSchema, ValidationOptions } from "joi";
import { flow, get } from "lodash/fp";
import {
  throwBadRequestError,
  throwUnauthorizedError,
} from "../errors/ErrorGenerators";
import { getContext } from "../helpers/context";
import { wrapValidator } from "../helpers/wrapper";

export const defaultValidationOptions: ValidationOptions = {
  abortEarly: false,
  allowUnknown: false,
  convert: true,
};

// joi validation for noraml schemas
export const validateRequest =
  (schema: ObjectSchema): any =>
  async (req: Request) =>
    await schema
      .validateAsync(req)
      .catch(flow(get("message"), throwBadRequestError));

// joi validation for schemas that changes according to the permission of the user
export const validateRequestByPermission = (
  allValidations: {
    permissions: Permission[];
    schema: ObjectSchema<any>;
  }[]
) => {
  const validator = async (req: Request): Promise<void> => {
    const wantedValidation = allValidations.find((validation) =>
      validation.permissions.includes(getContext(Global.USER).permission)
    );

    wantedValidation
      ? await validateRequest(wantedValidation.schema)(req)
      : throwUnauthorizedError("Invalid Permission");
  };
  return wrapValidator(validator);
};
