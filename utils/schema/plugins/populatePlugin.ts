import * as mongoose from "mongoose";
import { Global } from "../../../enums/helpers/Global";
import { postGetAllFunctionTypes } from "../helpers/schemaHelpers";

const contextService = require("request-context");

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
      if (!contextService.get(Global.SKIP_PLUGINS)) {
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
      const depth = contextService.get(Global.DEPTH);
      if (!depth) {
        contextService.set(Global.DEPTH, 1);
      }
      if (!contextService.get(Global.SKIP_PLUGINS) && depth <= 3) {
        options.map((p) => this.populate(p.path));
        contextService.set(Global.DEPTH, depth + 1);
      }
      next();
    })
  );
}
