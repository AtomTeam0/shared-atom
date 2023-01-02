import * as mongoose from "mongoose";
import { isWithSearch } from "../../helpers/aggregation";

export function virtualsPlugin(schema: mongoose.Schema) {
  schema.pre(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      next: mongoose.HookNextFunction
    ) {
      if (schema.get("id")) {
        this.pipeline().splice(isWithSearch(this.pipeline()) ? 2 : 0, 0, {
          $project: { id: "$_id", _id: 0 },
        });
      }
      next();
    }
  );
}
