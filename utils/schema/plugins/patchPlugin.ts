/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { IUser } from "../../../interfaces/user.interface";
import { userPatcher, userPatcherBoolean } from "../helpers/userHelpers";
import {
  postGetManyFunctionTypes,
  postGetSingleFunctionTypes,
} from "../helpers/schemaHelpers";
import { getContext } from "../../helpers/context";
import { Global } from "../../../enums/helpers/Global";

export function patchObjectPlugin(
  schema: mongoose.Schema,
  options: {
    foreignArrayProperty: keyof IUser & string;
    foreignIdProperty: string;
    defaultValue: { [k: string]: any };
  }
) {
  const enhanceProperties = async (doc: any) =>
    (await userPatcher(
      options.foreignArrayProperty,
      options.foreignIdProperty,
      String(doc._id)
    )) || options.defaultValue;

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
            Object.assign(item, ...(await enhanceProperties(item)));
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
          Object.assign(res._doc, ...(await enhanceProperties(res._doc)));
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
            res.map(async (item) => {
              Object.assign(item._doc, ...(await enhanceProperties(item._doc)));
            })
          );
        }
        next();
      }
    )
  );
}

export function patchBooleanPlugin(
  schema: mongoose.Schema,
  options: {
    foreignArrayProperty: keyof IUser & string;
    localBoolProperty: string;
    defaultValue: boolean;
  }
) {
  const enhanceBooleanProperty = async (doc: any) => ({
    [options.localBoolProperty]:
      (await userPatcherBoolean(
        options.foreignArrayProperty,
        String(doc._id)
      )) || options.defaultValue,
  });

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
            Object.assign(item, await enhanceBooleanProperty(item));
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
          Object.assign(res._doc, await enhanceBooleanProperty(res._doc));
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
            res.map(async (item) => {
              Object.assign(item._doc, await enhanceBooleanProperty(item._doc));
            })
          );
        }
        next();
      }
    )
  );
}
