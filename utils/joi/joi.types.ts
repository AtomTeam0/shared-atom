import * as JoiBase from "joi";

// regex
const base64regex =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

const personalIdRegex = /^[0-9]{9}$/;

const pdfURLRegex = /^(http.+)(\.pdf)$/;

const coordinateAxisRegex = /^-?[0-9]{1,3}(?:\.[0-9]{1,15})?$/;

// extentions
const blobExtention: JoiBase.ExtensionFactory = (joi: any) => ({
  type: "joiBlob",
  base: joi.string(),
  messages: {
    "joiBlob.invalid": "{{#label}} must be a base64 string",
  },
  validate(value, helpers) {
    const isValid = base64regex.test(value);
    if (!isValid) {
      return { value, errors: helpers.error("joiBlob.invalid") };
    }
    return { value };
  },
});

const mongoIdExtention: JoiBase.ExtensionFactory = (joi: any) => ({
  type: "joiMongoId",
  base: joi.string(),
  messages: {
    "joiMongoId.invalid": "{{#label}} must be a mongo id string",
    "joiMongoId.notFound": "{{#label}} was not found in the db",
  },
  rules: {
    getByIdFunc: {
      multi: true,
      method(func) {
        return this.$_setFlag("func", func);
      },
      args: [
        {
          name: "func",
          ref: true,
          assert: (value) => typeof value === "function",
          message: "must be a function",
        },
      ],
    },
  },
  async validate(value, helpers) {
    let error;
    const isValid = mongoIdRegex.test(value);
    if (!isValid) {
      error = helpers.error("joiMongoId.invalid");
    } else if (helpers.schema.$_getFlag("func")) {
      try {
        const { skipPlugins } = <any>global;
        (<any>global).skipPlugins = true;
        const res = await helpers.schema.$_getFlag("func")(value);
        (<any>global).skipPlugins = skipPlugins;
        if (!res) {
          error = helpers.error("joiMongoId.notFound");
        }
      } catch (err) {
        error = err;
      }
    }

    if (error) {
      return { value, errors: error };
    }
    return { value };
  },
});

const mongoIdArrayExtention: JoiBase.ExtensionFactory = (joi: any) => ({
  type: "joiMongoIdArray",
  base: joi.array().items(joi.string()),
  messages: {
    "joiMongoIdArray.invalid": "{{#label}} all items must be a mongo id string",
    "joiMongoIdArray.notFound":
      "one or more id`s from {{#label}} was not found in the db",
  },
  rules: {
    getByIdFunc: {
      multi: true,
      method(func) {
        return this.$_setFlag("func", func);
      },
      args: [
        {
          name: "func",
          ref: true,
          assert: (value) => typeof value === "function",
          message: "must be a function",
        },
      ],
    },
  },
  async validate(value, helpers) {
    let error;
    const isValid = value.every((singleVal: string) =>
      mongoIdRegex.test(singleVal)
    );
    if (!isValid) {
      error = helpers.error("joiMongoIdArray.invalid");
    } else if (helpers.schema.$_getFlag("func")) {
      try {
        const { skipPlugins } = <any>global;
        (<any>global).skipPlugins = true;
        const res = await Promise.all(
          value.map(async (id: string) => helpers.schema.$_getFlag("func")(id))
        );
        (<any>global).skipPlugins = skipPlugins;
        if (res.some((result: any) => !result)) {
          error = helpers.error("joiMongoIdArray.notFound");
        }
      } catch (err) {
        error = err;
      }
    }

    if (error) {
      return { value, errors: error };
    }
    return { value };
  },
});

const Joi = JoiBase.extend(
  blobExtention,
  mongoIdExtention,
  mongoIdArrayExtention
);

// exported types
export const joiEnum = (enumObj: { [k: string]: string }) =>
  Joi.string().valid(...Object.values(enumObj));

export const joiMongoId = (getByIdFunc?: (id: string) => any) =>
  Joi.joiMongoId().getByIdFunc(getByIdFunc);

export const joiMongoIdArray = (getByIdFunc?: (id: string) => any) =>
  Joi.joiMongoIdArray().getByIdFunc(getByIdFunc);

export const joiBlob = Joi.joiBlob();

export const joiPersonalId = Joi.string().regex(personalIdRegex);

export const joiPdfURL = Joi.string().regex(pdfURLRegex);

export const joiCoordinateAxis = Joi.string().regex(coordinateAxisRegex);
