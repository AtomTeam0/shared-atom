import * as mongoose from "mongoose";
import { setPluginUsage } from "../plugin.helpers";
import { queryAllFunctionTypes } from "../schemaHelpers";

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
      if (!(<any>global).skipCondition) {
        this.pipeline().unshift({
          $match: { [options.propertyName]: options.wantedVal },
        });
      }
      setPluginUsage({ skipCondition: true });
      next();
    }
  );

  queryAllFunctionTypes.map((type: string) =>
    schema.pre(type, function (next: mongoose.HookNextFunction) {
      if (!(<any>global).skipCondition) {
        this.where({ [options.propertyName]: options.wantedVal });
      }
      setPluginUsage({ skipCondition: true });
      next();
    })
  );
}
