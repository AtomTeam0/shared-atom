import * as mongoose from "mongoose";

export function virtualsPlugin(schema: mongoose.Schema) {
  schema.pre(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      next: mongoose.HookNextFunction
    ) {
      this.pipeline().unshift({
        $project: { id: "$_id", _id: 0 },
      });
      next();
    }
  );
}
