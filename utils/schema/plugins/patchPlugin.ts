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
import { queryFunctionTypes } from "../schemaHelpers";
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
        this.pipeline().push(...(await patchInAggregation(options)));
      }
      next();
    }
  );

  queryFunctionTypes.map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        doc: any,
        next: mongoose.HookNextFunction
      ) {
        if (!(<any>global).skipPatch) {
          doc = {
            ...doc,
            ...((await userPatcher(
              options.foreignArrayProperty,
              options.foreignIdProperty,
              doc._id
            )) || options.defaultValue),
          };
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
  schema.pre(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      next: mongoose.HookNextFunction
    ) {
      if (!(<any>global).skipPatch) {
        this.pipeline().push(...(await patchBooleanInAggregation(options)));
      }
      setPluginUsage(true, true, true);
      next();
    }
  );

  queryFunctionTypes.map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        doc: any,
        next: mongoose.HookNextFunction
      ) {
        if (!(<any>global).skipPatch) {
          doc = {
            ...doc,
            [options.localBoolProperty]:
              (await userPatcherBoolean(
                options.foreignArrayProperty,
                doc._id
              )) || options.defaultValue,
          };
        }
        setPluginUsage(true, true, true);
        next();
      }
    )
  );
}
