/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import * as Joi from "joi";
import * as turf from "@turf/turf";
import { Global } from "common-atom/enums/helpers/Global";
import { IArea } from "common-atom/interfaces/area.interface";
import { Section } from "common-atom/enums/Section";
import { Category } from "common-atom/enums/Category";
import { Corp } from "common-atom/enums/Corp";
import { Grade } from "common-atom/enums/Grade";
import { IPageRange } from "common-atom/interfaces/subject.interface";
import { ItemRPCService } from "../rpc/services/item.RPCservice";
import {
  IdNotFoundError,
  InvalidMongoIdError,
  PoligonIntersectionError,
  InvalidCoordinateError,
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
export const joiMongoId = (getByIdFunc?: (id: string) => any) =>
  Joi.string().external(async (value: string | undefined, _helpers: any) => {
    if (value !== undefined) {
      const isValid = mongoIdRegex.test(value);
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

export const joiContentId = Joi.string().external(
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

export const joiPoligon = Joi.array()
  .items(Joi.array().items(Joi.number()))
  .external(async (value: number[][] | undefined, _helpers: any) => {
    if (value !== undefined) {
      const isValid =
        value.length &&
        value.every(
          (coordinateArray: number[]) =>
            coordinateArray.length === 2 &&
            coordinateArray.every((coordinate: number) =>
              coordinateAxisRegex.test(coordinate.toString())
            )
        );
      if (!isValid) {
        throw new InvalidCoordinateError();
      }
      const givenPolygon = turf.polygon([
        value.map((coordinateArray: number[]) =>
          coordinateArray.map((coordinate: number) => +coordinate)
        ),
      ]);
      const isIntersecting = (await ItemRPCService.getAreas()).some(
        (area: IArea) => {
          const areaPolygon = turf.polygon([area.polygon]);
          return !!turf.intersect(givenPolygon, areaPolygon);
        }
      );
      if (isIntersecting) {
        throw new PoligonIntersectionError();
      }
    }
    return value;
  });

export const joiCoordinate = Joi.array()
  .items(Joi.number())
  .external(async (value: number[] | undefined, _helpers: any) => {
    if (value !== undefined) {
      const isValid =
        value.length === 2 &&
        value.every((coordinateAxis: number) =>
          coordinateAxisRegex.test(coordinateAxis.toString())
        );
      if (!isValid) {
        throw new InvalidCoordinateError();
      }
    }
    return value;
  });

export const joiPages = Joi.array()
  .items(Joi.any())
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
  Joi.array().items(joiMongoId(getByIdFunc));

export const joiEnum = (enumObj: { [k: string]: string }) =>
  Joi.string().valid(...Object.values(enumObj));

export const joiBlob = Joi.string();

export const joiPersonalId = Joi.string().regex(personalIdRegex);

export const joiFreeText = Joi.string().regex(freeTextRegex);

export const joiPriority = Joi.number().integer().min(1).max(100);

export const joiPriorityTollat = Joi.number().integer().min(1).max(3);

export const joiContentCreator = (contentValidator: Joi.Schema) =>
  Joi.object({
    params: {},
    body: Joi.object({
      content: contentValidator.required(),
      item: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        timeToRead: Joi.number().integer().required(),
        thumbNail: Joi.string().required(),
        unit: joiMongoId(ItemRPCService.getUnitById).required(),
        similarItems: joiMongoIdArray(ItemRPCService.getItemById),
        areas: joiMongoIdArray(ItemRPCService.getAreaById).min(1).required(),
        sections: Joi.array().items(joiEnum(Section)).min(1).required(),
        categories: Joi.array().items(joiEnum(Category)).min(1).required(),
        corps: Joi.array().items(joiEnum(Corp)).min(1).required(),
        grade: joiEnum(Grade).required(),
        priority: joiPriority,
      }),
      contentId: joiContentId,
    })
      .xor("item", "contentId")
      .required(),
    query: {},
  });
