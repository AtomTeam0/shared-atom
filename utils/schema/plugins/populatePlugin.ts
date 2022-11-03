import * as mongoose from "mongoose";
import { Global } from "../../../enums/helpers/Global";
import { getContext } from "../../helpers/context";
import { postGetAllFunctionTypes } from "../helpers/schemaHelpers";

export function populatePlugin(
  schema: mongoose.Schema,
  options: { path: string; ref: string }[]
) {
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
      if (!getContext(Global.SKIP_PLUGINS)) {
        options.map((p) =>
          this.populate({
            path: p.path,
            options: { options: { _depth: 1, maxDepth: 3 } },
          })
        );
      }
      next();
    })
  );
}
