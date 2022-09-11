import * as mongoose from "mongoose";
import { IUser } from "../../interfaces/user.interface";
import { userPatcherBooleanCheck, userPatcher } from "./user/user.helpers";
import { queryFunctionTypes } from "./schemaHelpers";

export function patchBooleanPlugin(
  schema: mongoose.Schema,
  options: {
    foreignArrayProperty: keyof IUser & string;
    localboolProperty: string;
    defaultValue: boolean;
  }
) {
  queryFunctionTypes.map((type: string) =>
    schema.post(
      type,
      { document: false, query: true },
      async (doc, next: mongoose.HookNextFunction) => {
        // eslint-disable-next-line no-param-reassign
        doc = {
          ...doc,
          ...(await userPatcherBooleanCheck(
            options.foreignArrayProperty,
            options.localboolProperty,
            options.defaultValue,
            doc
          )),
        };
        next();
      }
    )
  );
}

export function patchObjectPlugin(
  schema: mongoose.Schema,
  options: {
    foreignArrayProperty: keyof IUser & string;
    foreignIdProperty: string;
    defaultValue: { [k: string]: any };
  }
) {
  queryFunctionTypes.map((type: string) =>
    schema.post(
      type,
      { document: false, query: true },
      async (doc, next: mongoose.HookNextFunction) => {
        // eslint-disable-next-line no-param-reassign
        doc = {
          ...doc,
          ...(await userPatcher(
            options.foreignArrayProperty,
            options.foreignIdProperty,
            options.defaultValue,
            doc
          )),
        };
        next();
      }
    )
  );
}
