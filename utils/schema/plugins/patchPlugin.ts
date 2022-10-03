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
      this.pipeline().unshift(...(await patchInAggregation(options)));
      next();
    }
  );

  const enhanceItem = async (item: any) => ({
    ...item._doc,
    ...((await userPatcher(
      options.foreignArrayProperty,
      options.foreignIdProperty,
      String(item._id)
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
        if (res) {
          res._doc = await enhanceItem(res);
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
        if (res) {
          res.forEach(async (item) => {
            item._doc = await enhanceItem(item);
          });
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
      this.pipeline().unshift(...(await patchBooleanInAggregation(options)));
      next();
    }
  );

  const enhanceItem = async (item: any) => ({
    ...item._doc,
    [options.localBoolProperty]:
      (await userPatcherBoolean(
        options.foreignArrayProperty,
        String(item._id)
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
        if (res) {
          res._doc = await enhanceItem(res);
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
        if (res) {
          res.forEach(async (item) => {
            item._doc = await enhanceItem(item);
          });
        }
        next();
      }
    )
  );
}
