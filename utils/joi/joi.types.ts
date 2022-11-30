/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import * as Joi from "joi";
import * as turf from "@turf/turf";
import { Global } from "../../enums/helpers/Global";
import {
  IdNotFoundError,
  InvalidMongoIdError,
  PoligonIntersectionError,
  InvalidCoordinateError,
  InvalidWeekNumError,
} from "../errors/validationError";
import { getContext, setContext } from "../helpers/context";
import { IArea } from "../../interfaces/area.interface";

// regex
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

const personalIdRegex = /^[0-9]{9}$/;

const pdfURLRegex = /^(http.+)(\.pdf)$/;

const coordinateAxisRegex = /^-?[0-9]{1,3}(?:\.[0-9]{1,15})?$/;

// exported types
export const joiMongoId = (getByIdFunc?: (id: string) => any) =>
  Joi.string().external(async (value: string | undefined, helpers: any) => {
    if (value !== undefined) {
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

export const joiPoligon = (getAreasFunc: () => Promise<IArea[]>) =>
  Joi.array()
    .items(Joi.array().items(Joi.number()))
    .external(async (value: number[][] | undefined, helpers: any) => {
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
        const isIntersecting = (await getAreasFunc()).some((area: IArea) => {
          const areaPolygon = turf.polygon([area.polygon]);
          return !!turf.intersect(givenPolygon, areaPolygon);
        });
        if (isIntersecting) {
          throw new PoligonIntersectionError();
        }
      }
      return value;
    });

export const joiCoordinate = Joi.array()
  .items(Joi.number())
  .external(async (value: number[] | undefined, helpers: any) => {
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

export const joiWeekNum = Joi.number()
  .integer()
  .external(async (value: number | undefined, helpers: any) => {
    if (value !== undefined) {
      const isValid = value >= 1 && value <= 52;
      if (!isValid) {
        throw new InvalidWeekNumError();
      }
      const numOfDays = 1 + (value - 1) * 7; // 1st of January + 7 days for each week
      const currentYear = new Date().getFullYear(); // returns the current year
      return {
        weekStartDate: new Date(currentYear, 0, numOfDays),
        weekEndDate: new Date(currentYear, 0, numOfDays + 6),
      };
    }
    return value;
  });

export const joiMongoIdArray = (getByIdFunc?: (id: string) => any) =>
  Joi.array().items(joiMongoId(getByIdFunc));

export const joiEnum = (enumObj: { [k: string]: string }) =>
  Joi.string().valid(...Object.values(enumObj));

export const joiBlob = Joi.string().base64({ paddingRequired: false });

export const joiPersonalId = Joi.string().regex(personalIdRegex);

export const joiPdfURL = Joi.string().regex(pdfURLRegex);

export const joiPriority = Joi.number().integer().min(1).max(100);
