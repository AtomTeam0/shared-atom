import * as mongoose from "mongoose";
import { queryAllFunctionTypes } from "../helpers/schemaHelpers";

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
      if (!(<any>global).skipPlugins) {
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

  queryAllFunctionTypes.map((type: string) =>
    schema.pre(type, function (next: mongoose.HookNextFunction) {
      if (!(<any>global).depth) {
        (<any>global).depth = 1;
      }
      if (!(<any>global).skipPlugins && (<any>global).depth <= 3) {
        options.map((p) => this.populate(p.path));
        (<any>global).depth = (<any>global).depth + 1;
      }
      next();
    })
  );
}
