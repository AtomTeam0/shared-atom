/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { FileTypes } from "../../../common/enums/helpers/FileTypes";
import { Global } from "../../../common/enums/helpers/Global";
import {
  getContext,
  runWithContext,
  setContext,
  shouldSkipPlugins,
} from "../../helpers/context";
import {
  PorpertyOptionalDeep,
  propertyValGetter,
  propertyValSetter,
} from "../../helpers/types";
import { createBlob, downloadBlob, updateBlob } from "../helpers/blobHelpers";
import {
  postGetSingleFunctionTypes,
  postGetManyFunctionTypes,
  preCreationFunctionType,
  preUpdateFunctionType,
} from "../helpers/schemaHelpers";

export function blobPlugin<T>(
  schema: mongoose.Schema,
  options: {
    property: PorpertyOptionalDeep<T>;
    fileType: FileTypes;
  }[]
) {
  const getOldBlobName = async (
    query: mongoose.Query<any, any>,
    property: PorpertyOptionalDeep<T>
  ) => {
    const wantedId = query.getFilter()._id;
    const oldDoc = await runWithContext(() => {
      setContext(Global.SKIP_PLUGINS, true);
      return query.model.findById(wantedId).exec();
    });
    if (oldDoc) {
      return propertyValGetter<T>(oldDoc, property);
    }
    return undefined;
  };

  const modifyProperties = async (
    doc: any,
    blobAction: (...args: any) => Promise<string>
  ) =>
    Promise.all(
      options.map(async (option) => {
        const currentVal = propertyValGetter<T>(doc, option.property);
        return (
          currentVal &&
          propertyValSetter<T>(
            doc,
            option.property,
            await blobAction(currentVal, option)
          )
        );
      })
    );

  const downloadProperties = (doc: any) =>
    modifyProperties(
      doc,
      (
        blobName: string,
        property: {
          property: PorpertyOptionalDeep<T>;
          fileType: FileTypes;
        }
      ) => downloadBlob(blobName, property.fileType)
    );

  const createProperties = (doc: any) =>
    modifyProperties(
      doc,
      (
        path: string,
        property: {
          property: PorpertyOptionalDeep<T>;
          fileType: FileTypes;
        }
      ) => createBlob(JSON.parse(path), property.fileType)
    );

  const updateProperties = (doc: any, query: mongoose.Query<any, any>) =>
    modifyProperties(
      doc,
      async (
        path: string,
        property: {
          property: PorpertyOptionalDeep<T>;
          fileType: FileTypes;
        }
      ) => {
        const oldBlobName = await getOldBlobName(query, property.property);
        return (
          oldBlobName &&
          updateBlob(JSON.parse(path), property.fileType, oldBlobName)
        );
      }
    );

  schema.pre(
    preCreationFunctionType,
    async function (this: any, next: (err?: mongoose.CallbackError) => void) {
      if (!shouldSkipPlugins()) {
        Object.assign(this, ...(await createProperties(this)));
      }
      next();
    }
  );

  schema.pre(
    preUpdateFunctionType,
    async function (
      this: mongoose.Query<any, any>,
      next: (err?: mongoose.CallbackError) => void
    ) {
      if (!shouldSkipPlugins()) {
        const updateObj = this.getUpdate();
        this.setUpdate(
          Object.assign(
            updateObj as object,
            ...(await updateProperties(updateObj, this))
          )
        );
      }
      next();
    }
  );

  schema.pre(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      next: (err?: mongoose.CallbackError) => void
    ) {
      (this as any).skipPlugins = getContext(Global.SKIP_PLUGINS);
      next();
    }
  );

  postGetSingleFunctionTypes.map((type: string) =>
    schema.pre(
      type,
      async function (
        this: mongoose.Query<any, any>,
        next: (err?: mongoose.CallbackError) => void
      ) {
        (this as any).skipPlugins = getContext(Global.SKIP_PLUGINS);
        next();
      }
    )
  );

  postGetManyFunctionTypes.map((type: string) =>
    schema.pre(
      type,
      async function (
        this: mongoose.Query<any, any>,
        next: (err?: mongoose.CallbackError) => void
      ) {
        (this as any).skipPlugins = getContext(Global.SKIP_PLUGINS);
        next();
      }
    )
  );

  schema.post(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      res: any[],
      next: (err?: mongoose.CallbackError) => void
    ) {
      if (!shouldSkipPlugins((this as any).skipPlugins) && !!res) {
        await Promise.all(
          res.map(async (item) => {
            Object.assign(item, ...(await downloadProperties(item)));
          })
        );
      }
      next();
    }
  );

  postGetSingleFunctionTypes.map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        res: any,
        next: (err?: mongoose.CallbackError) => void
      ) {
        if (!shouldSkipPlugins((this as any).skipPlugins) && !!res) {
          Object.assign(res._doc, ...(await downloadProperties(res._doc)));
        }
        next();
      }
    )
  );

  postGetManyFunctionTypes.map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        res: any[],
        next: (err?: mongoose.CallbackError) => void
      ) {
        if (!shouldSkipPlugins((this as any).skipPlugins) && !!res) {
          await Promise.all(
            res.map(async (item: any) => {
              Object.assign(
                item._doc,
                ...(await downloadProperties(item._doc))
              );
            })
          );
        }
        next();
      }
    )
  );
}
