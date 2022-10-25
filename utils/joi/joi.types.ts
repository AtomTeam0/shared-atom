import * as JoiBase from "joi";

const Joi = JoiBase.extend((joi: any) => ({
  type: "joiBlob",
  base: joi.string(),
  messages: {
    "joiBlob.invalid": "{{#label}} must be a base64 string",
  },
  validate(value, helpers) {
    const base64regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const isValid = base64regex.test(value);
    if (!isValid) {
      return { value, errors: helpers.error("joiBlob.invalid") };
    }
    return { value };
  },
}));

export const joiEnum = (enumObj: { [k: string]: string }) =>
  Joi.string().valid(...Object.values(enumObj));

export const joiBlob = Joi.joiBlob();

export const joiMongoId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const joiPersonalId = Joi.string().regex(/^[0-9]{9}$/);

export const joiPdfURL = Joi.string().regex(/^(http.+)(\.pdf)$/);

export const joiCoordinateAxis = Joi.string().regex(
  /^-?[0-9]{1,3}(?:\.[0-9]{1,15})?$/
);
