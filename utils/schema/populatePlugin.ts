import * as mongoose from "mongoose";
import { queryFunctionTypes } from "./schemaHelpers";

export function populatePlugin(
  schema: mongoose.Schema,
  properties: { path: string; ref: string }[]
) {
  schema.pre(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      next: mongoose.HookNextFunction
    ) {
      properties.forEach((p) => {
        this.pipeline().unshift({
          $lookup: {
            from: p.ref,
            foreignField: "_id",
            localField: p.path,
            as: p.path,
          },
        });
      });
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
        this.populate(properties.map((p) => p.path));
        next();
      }
    )
  );
}
