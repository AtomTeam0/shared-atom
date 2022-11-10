import * as mongoose from "mongoose";
import { Global } from "../../../enums/helpers/Global";
import { getContext, setContext } from "../../helpers/context";
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
      if (!getContext(Global.SKIP_PLUGINS)) {
        Object.assign(
          this,
          options.map(
            (p) =>
              this[p.path] &&
              (p.isArray
                ? this[p.path].map((innerId: string) =>
                    mongoose.Types.ObjectId(innerId)
                  )
                : mongoose.Types.ObjectId(this[p.path]))
          )
        );
      }
      next();
    }
  );

  schema.pre(
    preUpdateFunctionType,
    async function (this: any, next: (err?: mongoose.CallbackError) => void) {
      if (!getContext(Global.SKIP_PLUGINS)) {
        Object.assign(
          this,
          options.map(
            (p) =>
              this[p.path] &&
              (p.isArray
                ? this[p.path].map((innerId: string) =>
                    mongoose.Types.ObjectId(innerId)
                  )
                : mongoose.Types.ObjectId(this[p.path]))
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
      if (!getContext(Global.SKIP_PLUGINS)) {
        options.forEach((p) => {
          this.pipeline().unshift({
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
      const depth = getContext(Global.DEPTH);
      if (!getContext(Global.SKIP_PLUGINS) && depth <= 3) {
        options.map((p) => this.populate(p.path));
        setContext(Global.DEPTH, depth + 1);
      }
      next();
    })
  );
}
