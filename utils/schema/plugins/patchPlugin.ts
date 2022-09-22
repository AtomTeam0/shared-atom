import * as mongoose from "mongoose";
import { IUser } from "../../../interfaces/user.interface";
import {
  patchInAggregation,
  userPatcher,
  patchBooleanInAggregation,
  userPatcherBoolean,
} from "../user.helpers";
import { queryFunctionTypes } from "../schemaHelpers";

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
      this: mongoose.Aggregate<any> & { isSecondIteration: boolean },
      next: mongoose.HookNextFunction
    ) {
      this.pipeline().push(...(await patchInAggregation(options)));
      next();
    }
  );

  queryFunctionTypes.map((type: string) =>
    schema.post(type, async (doc: any, next: mongoose.HookNextFunction) => {
      // eslint-disable-next-line no-param-reassign
      doc = {
        ...doc,
        ...((await userPatcher(
          options.foreignArrayProperty,
          options.foreignIdProperty,
          doc._id
        )) || options.defaultValue),
      };
      next();
    })
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
      this: mongoose.Aggregate<any> & { isSecondIteration: boolean },
      next: mongoose.HookNextFunction
    ) {
      this.pipeline().push(...(await patchBooleanInAggregation(options)));
      next();
    }
  );

  queryFunctionTypes.map((type: string) =>
    schema.post(type, async (doc: any, next: mongoose.HookNextFunction) => {
      // eslint-disable-next-line no-param-reassign
      doc = {
        ...doc,
        [options.localBoolProperty]:
          (await userPatcherBoolean(options.foreignArrayProperty, doc._id)) ||
          options.defaultValue,
      };
      next();
    })
  );
}
