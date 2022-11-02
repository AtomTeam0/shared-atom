import * as mongoose from "mongoose";
import { Global } from "../../../enums/helpers/Global";
import { Permission } from "../../../enums/Permission";
import { postGetAllFunctionTypes } from "../helpers/schemaHelpers";

const contextService = require("request-context");

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
        !contextService.get(Global.SKIP_PLUGINS) &&
        !(
          contextService.get(Global.PERMISSION) &&
          options.bypassPermissions.includes(
            contextService.get(Global.PERMISSION)
          )
        )
      ) {
        this.pipeline().unshift({
          $match: { [options.propertyName]: options.wantedVal },
        });
      }
      next();
    }
  );

  postGetAllFunctionTypes.map((type: string) =>
    schema.pre(type, function (next: mongoose.HookNextFunction) {
      if (
        !contextService.get(Global.SKIP_PLUGINS) &&
        !(
          contextService.get(Global.PERMISSION) &&
          options.bypassPermissions.includes(
            contextService.get(Global.PERMISSION)
          )
        )
      ) {
        this.where({ [options.propertyName]: options.wantedVal });
      }
      next();
    })
  );
}
