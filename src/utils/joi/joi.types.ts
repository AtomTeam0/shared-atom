/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import joi from "joi";
import { Global } from "common-atom/enums/helpers/Global";
import { IPageRange } from "common-atom/interfaces/subject.interface";
import { ItemRPCService } from "../rpc/services/item.RPCservice";
import {
  IdNotFoundError,
  InvalidMongoIdError,
  InvalidPageRange,
} from "../errors/validationError";
import { getContext, putSkipPlugins } from "../helpers/context";

// regex
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

const personalIdRegex = /^[0-9]{9}$/;

const coordinateAxisRegex = /^-?[0-9]{1,3}(?:\.[0-9]{1,15})?$/;

const blobRegex = /^{(?=.*filepath)(?=.*originalFilename).*}$/;

const freeTextRegex = /^[\u0590-\u05FF0-9!?.,\s-'`]{0,250}$/;

// exported types
export const joiMongoId = (
  getByIdFunc?: (id: string) => any,
  isUserId = false
) =>
  joi.string().external(async (value: string | undefined, _helpers: any) => {
    if (value !== undefined) {
      const isValid = (isUserId ? personalIdRegex : mongoIdRegex).test(value);
      if (!isValid) {
        throw new InvalidMongoIdError();
      } else if (getByIdFunc) {
        const skipPlugins = getContext(Global.SKIP_PLUGINS);
        putSkipPlugins();
        const res = await getByIdFunc(value);
        putSkipPlugins(skipPlugins);
        if (!res) {
          throw new IdNotFoundError();
        }
      }
    }
    return value;
  });

export const joiContentId = joi.string().external(
  async (value: string | undefined, _helpers: any) => {
    if (value !== undefined) {
      const isValid = mongoIdRegex.test(value);
      if (!isValid) {
        throw new InvalidMongoIdError();
      }
      const skipPlugins = getContext(Global.SKIP_PLUGINS);
      putSkipPlugins();
      const res = await ItemRPCService.getItemByContentId(value);
      putSkipPlugins(skipPlugins);
      if (!res) {
        throw new IdNotFoundError("contentId");
      }
    }
    return value;
  }
);

export const joiPages = joi.array()
  .items(joi.any())
  .external(
    async (value: (IPageRange | number)[] | undefined, _helpers: any) => {
      if (value !== undefined) {
        const arrayRange = (start: number, stop: number, step = 1) =>
          Array.from(
            { length: (stop - start) / step + 1 },
            (_value, index) => start + index * step
          );
        const arr = value
          .map((item: IPageRange | number) =>
            typeof item === "number" ? item : arrayRange(item.from, item.to)
          )
          .flat();
        const isValid = new Set(arr).size === arr.length;
        if (!isValid) {
          throw new InvalidPageRange();
        }
      }
      return value;
    }
  );

export const joiMongoIdArray = (getByIdFunc?: (id: string) => any) =>
  joi.array().items(joiMongoId(getByIdFunc));

export const joiEnum = (enumObj: { [k: string]: string }) =>
  joi.string().valid(...Object.values(enumObj));

export const joiBlob = joi.string();

export const joiPersonalId = joi.string().regex(personalIdRegex);

export const joiFreeText = joi.string().regex(freeTextRegex);

export const joiPriority = joi.number().integer().min(1).max(100);
