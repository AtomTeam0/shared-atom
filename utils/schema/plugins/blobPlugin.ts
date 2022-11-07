/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { FileTypes } from "../../../enums/helpers/FileTypes";
import { Global } from "../../../enums/helpers/Global";
import { getContext, setContext } from "../../helpers/context";
import { createBlob, downloadBlob, updateBlob } from "../helpers/blobHelpers";
import {
  postGetSingleFunctionTypes,
  postGetManyFunctionTypes,
  preCreationFunctionType,
  preUpdateFunctionType,
} from "../helpers/schemaHelpers";

export function blobPlugin(
  schema: mongoose.Schema,
  options: {
    fatherProperty?: string;
    propertyName: string;
    fileType: FileTypes;
  }[]
) {
  const getOldBlobId = async (
    query: mongoose.Query<any, any>,
    porpertyName: string,
    fatherProperty?: string
  ) => {
    const wantedId = query.getFilter()._id;
    const skipPlugins = getContext(Global.SKIP_PLUGINS);
    setContext(Global.SKIP_PLUGINS, true);
    const oldDoc = await query.model.findById(wantedId).exec();
    setContext(Global.SKIP_PLUGINS, skipPlugins);
    if (oldDoc) {
      return fatherProperty
        ? oldDoc[fatherProperty][porpertyName]
        : oldDoc[porpertyName];
    }
    return undefined;
  };

  const modifyProperties = async (
    doc: any,
    blobAction: (...args: any) => void
  ) =>
    Promise.all(
      options.map(async (property) => {
        if (property.fatherProperty) {
          const father = doc[property.fatherProperty];
          if (father) {
            const nested = father[property.propertyName];
            return (
              nested && {
                [property.fatherProperty]: {
                  ...father,
                  [property.propertyName]: await blobAction(nested, property),
                },
              }
            );
          }
          return undefined;
        }

        return (
          doc[property.propertyName] && {
            [property.propertyName]: await blobAction(
              doc[property.propertyName],
              property
            ),
          }
        );
      })
    );

  const downloadProperties = (doc: any) =>
    modifyProperties(
      doc,
      (
        blobId: string,
        property: {
          fatherProperty?: string;
          propertyName: string;
          fileType: FileTypes;
        }
      ) => downloadBlob(blobId, property.fileType)
    );

  const createProperties = (doc: any) =>
    modifyProperties(
      doc,
      (
        base64Data: string,
        property: {
          fatherProperty?: string;
          propertyName: string;
          fileType: FileTypes;
        }
      ) => createBlob(base64Data, property.fileType)
    );

  const updateProperties = (doc: any, query: mongoose.Query<any, any>) =>
    modifyProperties(
      doc,
      async (
        base64Data: string,
        property: {
          fatherProperty?: string;
          propertyName: string;
          fileType: FileTypes;
        }
      ) => {
        const oldBlobId = await getOldBlobId(
          query,
          property.propertyName,
          property.fatherProperty
        );
        return (
          oldBlobId && updateBlob(base64Data, property.fileType, oldBlobId)
        );
      }
    );

  schema.pre(
    preCreationFunctionType,
    async function (this: any, next: (err?: mongoose.CallbackError) => void) {
      if (!getContext(Global.SKIP_PLUGINS)) {
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
      if (!getContext(Global.SKIP_PLUGINS)) {
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

  schema.post(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      res: any[],
      next: (err?: mongoose.CallbackError) => void
    ) {
      if (!getContext(Global.SKIP_PLUGINS) && !!res) {
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
        if (!getContext(Global.SKIP_PLUGINS) && !!res) {
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
        if (!getContext(Global.SKIP_PLUGINS) && !!res) {
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
