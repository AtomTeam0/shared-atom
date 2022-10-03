import * as mongoose from "mongoose";
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
        this.pipeline().unshift({
          $lookup: {
            from: p.ref,
            localField: p.path,
            foreignField: "_id",
            as: p.path,
          },
        });
      });
      next();
    }
  );

  queryAllFunctionTypes.map((type: string) =>
    schema.pre(type, function (next: mongoose.HookNextFunction) {
      if (!(<any>global).deepness) {
        (<any>global).deepness = 1;
      }
      if (!!(<any>global).deepness && (<any>global).deepness <= 2) {
        options.map((p) => this.populate(p.path));
        (<any>global).deepness = (<any>global).deepness + 1;
      }
      next();
    })
  );
}
