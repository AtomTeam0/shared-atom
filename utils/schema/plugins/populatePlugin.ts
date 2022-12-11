/* eslint-disable no-prototype-builtins */
import * as mongoose from "mongoose";
import { shouldSkipPlugins } from "../../helpers/context";
import {
  postGetAllFunctionTypes,
  preCreationFunctionType,
  preUpdateFunctionType,
} from "../helpers/schemaHelpers";

export function populatePlugin(
  schema: mongoose.Schema,
  options: { path: string; ref: string; isArray?: boolean }[]
) {
  schema.pre(
    preCreationFunctionType,
    async function (this: any, next: (err?: mongoose.CallbackError) => void) {
      if (!shouldSkipPlugins()) {
        Object.assign(
          this,
          ...options.map(
            (p) =>
              this[p.path] && {
                [p.path]: p.isArray
                  ? this[p.path].map((innerId: string) =>
                      mongoose.Types.ObjectId(innerId)
                    )
                  : mongoose.Types.ObjectId(this[p.path]),
              }
          )
        );
      }
      next();
    }
  );

  schema.pre(
    preUpdateFunctionType,
    async function (this: any, next: (err?: mongoose.CallbackError) => void) {
      if (!shouldSkipPlugins()) {
        Object.assign(
          this,
          ...options.map(
            (p) =>
              this[p.path] && {
                [p.path]: p.isArray
                  ? this[p.path].map((innerId: string) =>
                      mongoose.Types.ObjectId(innerId)
                    )
                  : mongoose.Types.ObjectId(this[p.path]),
              }
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
      next: mongoose.HookNextFunction
    ) {
      if (!shouldSkipPlugins()) {
        const firstPipe = this.pipeline()[0];
        const isWithSearch =
          firstPipe.hasOwnProperty("$match") &&
          firstPipe.$match.hasOwnProperty("$text");
        options.forEach((p) => {
          this.pipeline().splice(isWithSearch ? 2 : 0, 0, {
            $lookup: {
              from: p.ref,
              localField: p.path,
              foreignField: "_id",
              as: p.path,
            },
          });
        });
      }
      next();
    }
  );

  postGetAllFunctionTypes.map((type: string) =>
    schema.pre(type, function (next: mongoose.HookNextFunction) {
      if (!shouldSkipPlugins()) {
        options.map((p) =>
          this.populate({ path: p.path, options: { _recursed: true } })
        );
      }
      next();
    })
  );
}
