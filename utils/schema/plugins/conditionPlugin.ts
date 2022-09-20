import * as mongoose from "mongoose";
import { queryFunctionTypes } from "../schemaHelpers";

export function conditionPlugin(
  schema: mongoose.Schema,
  options: {
    propertyName: string;
    wantedVal: any;
  }
) {
  schema.pre(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      next: mongoose.HookNextFunction
    ) {
      this.pipeline().unshift({
        $match: { [options.propertyName]: options.wantedVal },
      });
      next();
    }
  );

  queryFunctionTypes.forEach((type: string) => {
    schema.pre(
      type,
      async function (
        this: mongoose.Query<any, any>,
        next: mongoose.HookNextFunction
      ) {
        this.where({ [options.propertyName]: options.wantedVal });
        next();
      }
    );
  });
}
