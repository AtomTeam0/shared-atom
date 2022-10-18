/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { FileTypes } from "../../../enums/helpers/FileTypes";
import { downloadBlob } from "../helpers/blobHelpers";
import {
  querySingleFunctionTypes,
  queryManyFunctionTypes,
} from "../helpers/schemaHelpers";

export function blobPlugin(
  schema: mongoose.Schema,
  options: {
    propertyName: string;
    fileType: FileTypes;
  }[]
) {
  const enhanceProperty = async (
    item: any,
    property: {
      propertyName: string;
      fileType: FileTypes;
    }
  ) =>
    item._doc[property.propertyName]
      ? {
          [property.propertyName]: await downloadBlob(
            item._doc[property.propertyName],
            property.fileType
          ),
        }
      : {};

  schema.post(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      res: any,
      next: mongoose.HookNextFunction
    ) {
      if (!(<any>global).skipPlugins && !!res) {
        await Promise.all(
          res.map(async (item: any) => {
            Object.assign(
              item._doc,
              ...(await Promise.all(
                options.map((p) => enhanceProperty(item, p))
              ))
            );
          })
        );
      }
      next();
    }
  );

  querySingleFunctionTypes.map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        res: any,
        next: (err?: mongoose.CallbackError) => void
      ) {
        if (!(<any>global).skipPlugins && !!res) {
          Object.assign(
            res._doc,
            ...(await Promise.all(options.map((p) => enhanceProperty(res, p))))
          );
        }
        next();
      }
    )
  );

  queryManyFunctionTypes.map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        res: any[],
        next: (err?: mongoose.CallbackError) => void
      ) {
        if (!(<any>global).skipPlugins && !!res) {
          await Promise.all(
            res.map(async (item: any) => {
              Object.assign(
                item._doc,
                ...(await Promise.all(
                  options.map((p) => enhanceProperty(item, p))
                ))
              );
            })
          );
        }
        next();
      }
    )
  );
}
