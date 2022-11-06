/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import * as Joi from "joi";
import { Global } from "../../enums/helpers/Global";
import {
  IdNotFoundError,
  InvalidMongoIdError,
} from "../errors/validationError";
import { getContext, setContext } from "../helpers/context";

// regex
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

const personalIdRegex = /^[0-9]{9}$/;

const pdfURLRegex = /^(http.+)(\.pdf)$/;

const coordinateAxisRegex = /^-?[0-9]{1,3}(?:\.[0-9]{1,15})?$/;

// exported types
export const joiMongoId = (getByIdFunc?: (id: string) => any) =>
  Joi.string().external(async (value: string | undefined, helpers: any) => {
    if (value) {
      const isValid = mongoIdRegex.test(value);
      if (!isValid) {
        throw new InvalidMongoIdError();
      } else if (getByIdFunc) {
        const skipPlugins = getContext(Global.SKIP_PLUGINS);
        setContext(Global.SKIP_PLUGINS, true);
        const res = await getByIdFunc(value);
        setContext(Global.SKIP_PLUGINS, skipPlugins);
        if (!res) {
          throw new IdNotFoundError();
        }
      }
    }
    return value;
  });

export const joiMongoIdArray = (getByIdFunc?: (id: string) => any) =>
  Joi.array().items(joiMongoId(getByIdFunc));

export const joiEnum = (enumObj: { [k: string]: string }) =>
  Joi.string().valid(...Object.values(enumObj));

export const joiBlob = Joi.string().base64();

export const joiPersonalId = Joi.string().regex(personalIdRegex);

export const joiPdfURL = Joi.string().regex(pdfURLRegex);

export const joiCoordinateAxis = Joi.string().regex(coordinateAxisRegex);
