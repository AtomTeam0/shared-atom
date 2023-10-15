/* eslint-disable no-nested-ternary */
import * as mongoose from "mongoose";
import { Plugins } from "common-atom/enums/Plugins";
import { isWithSearch } from "../../helpers/aggregation";
import { genericPreMiddleware } from "../helpers/pluginHelpers";
import {
  aggregationType,
  getAllFunctionTypes,
  creationFunctionType,
  updateFunctionType,
} from "../helpers/schemaHelpers";

export function populatePlugin<T>(
  schema: mongoose.Schema,
  options: {
    property: keyof T;
    ref: string;
    isArray?: boolean;
    isTazId?: boolean;
  }[]
) {
  const convertId = (innerId: string, isTazId?: boolean) =>
    isTazId ? innerId : mongoose.Types.ObjectId(innerId);
  genericPreMiddleware(
    schema,
    [...creationFunctionType, ...updateFunctionType],
    async (thisObject: any) => {
      Object.assign(
        thisObject,
        ...options.map(
          (p) =>
            thisObject[p.property] && {
              [p.property]: p.isArray
                ? thisObject[p.property].map((innerId: string) =>
                    convertId(innerId, p.isTazId)
                  )
                : convertId(thisObject[p.property], p.isTazId),
            }
        )
      );
    },
    Plugins.POPULATE
  );

  genericPreMiddleware(
    schema,
    aggregationType,
    async (thisObject: any) => {
      options.forEach((p) => {
        if (p.isArray) {
          thisObject
            .pipeline()
            .splice(isWithSearch(thisObject.pipeline()) ? 2 : 0, 0, {
              $lookup: {
                from: p.ref,
                localField: p.property,
                foreignField: "_id",
                as: p.property,
              },
            });
        } else {
          thisObject.pipeline().splice(
            isWithSearch(thisObject.pipeline()) ? 2 : 0,
            0,
            {
              $lookup: {
                from: p.ref,
                localField: p.property,
                foreignField: "_id",
                as: p.property,
              },
            },
            {
              $addFields: {
                [p.property]: {
                  $cond: {
                    if: {
                      $eq: [0, { $size: `$${p.property as string}` }],
                    },
                    then: [],
                    else: {
                      $arrayElemAt: [`$${p.property as string}`, 0],
                    },
                  },
                },
              },
            }
          );
        }
      });
    },
    Plugins.POPULATE
  );

  genericPreMiddleware(
    schema,
    getAllFunctionTypes,
    async (thisObject: any) => {
      options.map((p) =>
        thisObject.populate({ path: p.property, justOne: !p.isArray })
      );
    },
    Plugins.POPULATE
  );
}
