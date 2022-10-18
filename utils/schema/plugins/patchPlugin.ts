/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { IUser } from "../../../interfaces/user.interface";
import { userPatcher, userPatcherBoolean } from "../helpers/userHelpers";
import {
  queryManyFunctionTypes,
  querySingleFunctionTypes,
} from "../helpers/schemaHelpers";

export function patchObjectPlugin(
  schema: mongoose.Schema,
  options: {
    foreignArrayProperty: keyof IUser & string;
    foreignIdProperty: string;
    defaultValue: { [k: string]: any };
  }
) {
  // schema.pre(
  //   "aggregate",
  //   async function (
  //     this: mongoose.Aggregate<any>,
  //     next: mongoose.HookNextFunction
  //   ) {
  //     if (!(<any>global).skipPlugins) {
  //       this.pipeline().unshift(...(await patchInAggregation(options)));
  //     }
  //     next();
  //   }
  // );

  const enhanceDocument = async (doc: any) => ({
    ...doc,
    ...((await userPatcher(
      options.foreignArrayProperty,
      options.foreignIdProperty,
      String(doc._id)
    )) || options.defaultValue),
  });

  querySingleFunctionTypes.map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        res: any,
        next: (err?: mongoose.CallbackError) => void
      ) {
        if (!(<any>global).skipPlugins && !!res) {
          res._doc = await enhanceDocument(res._doc);
        }
        next();
      }
    )
  );

  ["aggregate", ...queryManyFunctionTypes].map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        res: any[],
        next: (err?: mongoose.CallbackError) => void
      ) {
        if (!(<any>global).skipPlugins && !!res) {
          await Promise.all(
            res.map(async (item) => {
              item._doc = await enhanceDocument(item._doc);
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
  // schema.pre(
  //   "aggregate",
  //   async function (
  //     this: mongoose.Aggregate<any>,
  //     next: mongoose.HookNextFunction
  //   ) {
  //     if (!(<any>global).skipPlugins) {
  //       this.pipeline().unshift(...(await patchBooleanInAggregation(options)));
  //     }
  //     next();
  //   }
  // );

  const enhanceDocument = async (doc: any) => ({
    ...doc,
    [options.localBoolProperty]:
      (await userPatcherBoolean(
        options.foreignArrayProperty,
        String(doc._id)
      )) || options.defaultValue,
  });

  querySingleFunctionTypes.map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        res: any,
        next: (err?: mongoose.CallbackError) => void
      ) {
        if (!(<any>global).skipPlugins && !!res) {
          res._doc = await enhanceDocument(res._doc);
        }
        next();
      }
    )
  );

  ["aggregate", ...queryManyFunctionTypes].map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        res: any[],
        next: (err?: mongoose.CallbackError) => void
      ) {
        if (!(<any>global).skipPlugins && !!res) {
          await Promise.all(
            res.map(async (item) => {
              item._doc = await enhanceDocument(item._doc);
            })
          );
        }
        next();
      }
    )
  );
}
