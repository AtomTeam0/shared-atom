import * as mongoose from "mongoose";
import { queryFunctionTypes } from "../schemaHelpers";

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
        this.pipeline().push({
          $lookup: {
            from: p.ref,
            localField: p.path,
            foreignField: "_id",
            as: p.path,
          },
        });
      });
      console.log(this.pipeline());
      next();
    }
  );

  queryFunctionTypes.map((type: string) =>
    schema.post(
      type,
      async function (
        this: mongoose.Query<any, any>,
        next: mongoose.HookNextFunction
      ) {
        this.populate(options.map((p) => p.path));
        next();
      }
    )
  );
}
