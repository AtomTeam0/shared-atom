/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { FileTypes } from "../../../enums/helpers/FileTypes";
import { downloadBlob, uploadBlob } from "../helpers/blobHelpers";
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
  const modifyProperties = async (doc: any, isDownloadMode: boolean) => {
    const func = isDownloadMode ? downloadBlob : uploadBlob;
    return Promise.all(
      options.map(async (p) =>
        doc[p.propertyName]
          ? {
              [p.propertyName]: await func(doc[p.propertyName], p.fileType),
            }
          : {}
      )
    );
  };

  const enhanceProperties = (doc: any) => modifyProperties(doc, true);
  const deformProperties = (doc: any) => modifyProperties(doc, false);

  schema.post(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      res: any[],
      next: (err?: mongoose.CallbackError) => void
    ) {
      if (!(<any>global).skipPlugins && !!res) {
        await Promise.all(
          res.map(async (item) => {
            Object.assign(item, ...(await enhanceProperties(item)));
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
          Object.assign(res._doc, ...(await enhanceProperties(res._doc)));
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
              Object.assign(item._doc, ...(await enhanceProperties(item._doc)));
            })
          );
        }
        next();
      }
    )
  );

  schema.pre(
    ["save", "init"],
    async function (this: any, next: (err?: mongoose.CallbackError) => void) {
      if (!(<any>global).skipPlugins) {
        Object.assign(this, ...(await deformProperties(this)));
      }
      next();
    }
  );
}
