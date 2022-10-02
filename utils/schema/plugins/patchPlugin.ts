/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import * as mongoose from "mongoose";
import { IUser } from "../../../interfaces/user.interface";
import {
  patchInAggregation,
  userPatcher,
  patchBooleanInAggregation,
  userPatcherBoolean,
} from "../user.helpers";
import {
  queryManyFunctionTypes,
  querySingleFunctionTypes,
} from "../schemaHelpers";
import { setPluginUsage } from "../plugin.helpers";

export function patchObjectPlugin(
  schema: mongoose.Schema,
  options: {
    foreignArrayProperty: keyof IUser & string;
    foreignIdProperty: string;
    defaultValue: { [k: string]: any };
  }
) {
  schema.pre(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      next: mongoose.HookNextFunction
    ) {
      if (!(<any>global).skipPatch) {
        this.pipeline().unshift(...(await patchInAggregation(options)));
      }
      setPluginUsage({ skipPatch: true });
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
        if (!(<any>global).skipPatch && !!res) {
          res._doc = {
            ...res._doc,
            ...((await userPatcher(
              options.foreignArrayProperty,
              options.foreignIdProperty,
              String(res._id)
            )) || options.defaultValue),
          };
        }
        setPluginUsage({ skipPatch: true });
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
        if (!(<any>global).skipPatch && !!res) {
          res = await Promise.all(
            res.map(async (doc) => ({
              ...doc,
              ...((await userPatcher(
                options.foreignArrayProperty,
                options.foreignIdProperty,
                String(doc._id)
              )) || options.defaultValue),
            }))
          );
        }
        setPluginUsage({ skipPatch: true });
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
  schema.pre(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      next: mongoose.HookNextFunction
    ) {
      if (!(<any>global).skipPatch) {
        this.pipeline().unshift(...(await patchBooleanInAggregation(options)));
      }
      setPluginUsage({ skipPatch: true });
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
        if (!(<any>global).skipPatch && !!res) {
          res._doc = {
            ...res._doc,
            [options.localBoolProperty]:
              (await userPatcherBoolean(
                options.foreignArrayProperty,
                String(res._id)
              )) || options.defaultValue,
          };
        }
        setPluginUsage({ skipPatch: true });
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
        if (!(<any>global).skipPatch && !!res) {
          res = await Promise.all(
            res.map(async (doc) => ({
              ...doc,
              [options.localBoolProperty]:
                (await userPatcherBoolean(
                  options.foreignArrayProperty,
                  String(doc._id)
                )) || options.defaultValue,
            }))
          );
        }
        setPluginUsage({ skipPatch: true });
        next();
      }
    )
  );
}
