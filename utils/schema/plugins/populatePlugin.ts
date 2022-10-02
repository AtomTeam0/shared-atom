import * as mongoose from "mongoose";
import { setPluginUsage } from "../plugin.helpers";
import { queryAllFunctionTypes } from "../schemaHelpers";

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
      options.forEach((p) => {
        if (!(<any>global).skipPopulate) {
          this.pipeline().unshift({
            $lookup: {
              from: p.ref,
              localField: p.path,
              foreignField: "_id",
              as: p.path,
            },
          });
        }
      });
      setPluginUsage({ skipPopulate: true });
      next();
    }
  );

  queryAllFunctionTypes.map((type: string) =>
    schema.pre(type, function (next: mongoose.HookNextFunction) {
      if (!(<any>global).skipPopulate) {
        options.map((p) => this.populate(p.path));
      }
      setPluginUsage({ skipPopulate: true });
      next();
    })
  );
}
