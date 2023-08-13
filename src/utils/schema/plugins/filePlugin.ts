import * as mongoose from "mongoose";
import { Plugins } from "common-atom/enums/Plugins";
import { PorpertyOptionalDeep } from "../../helpers/types";
import { createProperties, downloadProperties } from "../helpers/modifyHelpers";
import {
  genericPostMiddleware,
  genericPreMiddleware,
} from "../helpers/pluginHelpers";
import {
  getSingleFunctionTypes,
  getManyFunctionTypes,
  creationFunctionType,
  updateFunctionType,
  aggregationType,
} from "../helpers/schemaHelpers";

export function filePlugin<T>(
  schema: mongoose.Schema,
  options: PorpertyOptionalDeep<T>[]
) {
  genericPreMiddleware(
    schema,
    creationFunctionType,
    async (thisObject: any) => {
      Object.assign(
        thisObject,
        ...(await createProperties<T>(thisObject, options))
      );
    },
    Plugins.BLOB
  );

  genericPreMiddleware(
    schema,
    updateFunctionType,
    async (thisObject: any) => {
      const updateObj = thisObject.getUpdate();
      thisObject.setUpdate(
        Object.assign(
          updateObj as object,
          ...(await createProperties<T>(thisObject, options))
        )
      );
    },
    Plugins.BLOB
  );

  genericPostMiddleware(
    schema,
    aggregationType,
    async (_thisObject: any, res: any) => {
      const dataArray = Array.isArray(res) ? res : (res.data ? res.data : res);
      await Promise.all(
        dataArray.map(async (item: any) => {
          Object.assign(item, ...(await downloadProperties<T>(item, options)));
        })
      );
    },
    Plugins.BLOB
  );

  genericPostMiddleware(
    schema,
    getSingleFunctionTypes,
    async (_thisObject: any, res: any) => {
      Object.assign(
        res._doc,
        ...(await downloadProperties<T>(res._doc, options))
      );
    },
    Plugins.BLOB
  );

  genericPostMiddleware(
    schema,
    getManyFunctionTypes,
    async (_thisObject: any, res: any) => {
      await Promise.all(
        res.map(async (item: any) => {
          Object.assign(
            item._doc,
            ...(await downloadProperties<T>(item._doc, options))
          );
        })
      );
    },
    Plugins.BLOB
  );
}
