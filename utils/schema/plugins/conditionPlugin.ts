import * as mongoose from "mongoose";
import { Permission } from "../../../enums/Permission";
import { queryAllFunctionTypes } from "../schemaHelpers";

export function conditionPlugin(
  schema: mongoose.Schema,
  options: {
    propertyName: string;
    wantedVal: any;
    bypassPermissions: Permission[];
  }
) {
  schema.pre(
    "aggregate",
    async function (
      this: mongoose.Aggregate<any>,
      next: mongoose.HookNextFunction
    ) {
      if (
        !(
          (<any>global).permission &&
          options.bypassPermissions.includes((<any>global).permission)
        )
      ) {
        this.pipeline().unshift({
          $match: { [options.propertyName]: options.wantedVal },
        });
      }
      next();
    }
  );

  queryAllFunctionTypes.map((type: string) =>
    schema.pre(type, function (next: mongoose.HookNextFunction) {
      if (
        !(
          (<any>global).permission &&
          options.bypassPermissions.includes((<any>global).permission)
        )
      ) {
        this.where({ [options.propertyName]: options.wantedVal });
      }
      next();
    })
  );
}
