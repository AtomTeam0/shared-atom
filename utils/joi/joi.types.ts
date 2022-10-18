/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { validate as uuidValidate } from "uuid";
import * as JoiBase from "joi";

const Joi = JoiBase.extend((joi: any) => ({
  type: "joiBlobId",
  base: joi.string(),
  messages: {
    "joiBlobId.invalid": "{{#label}} must be a valid uuid",
  },
  validate(value, helpers) {
    const isValid = uuidValidate(value);
    if (!isValid) {
      return { value, errors: helpers.error("joiBlobId.invalid") };
    }
    return isValid;
  },
}));

export const joiEnum = (enumObj: { [k: string]: string }) =>
  Joi.string().valid(...Object.values(enumObj));
export const joiBlobId = Joi.joiBlobId();
export const joiMongoId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
export const joiPersonalId = Joi.string().regex(/^[0-9]{9}$/);
export const joiPdfURL = Joi.string().regex(/^(http.+)(\.pdf)$/);
export const joiCoordinate = Joi.string().regex(
  /^-?[0-9]{1,3}(?:\.[0-9]{1,10})?$/
);
