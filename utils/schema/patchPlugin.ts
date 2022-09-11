import * as mongoose from "mongoose";
import { IUser } from "../../interfaces/user.interface";
import { userPatcherBooleanCheck, userPatcher } from "./user/user.helpers";
import { queryFunctionTypes } from "./schemaHelpers";

export function patchBooleanPlugin(
  schema: mongoose.Schema,
  foreignArrayProperty: keyof IUser & string,
  localboolProperty: string,
  defaultValue: boolean
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
            foreignArrayProperty,
            localboolProperty,
            defaultValue,
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
  foreignArrayProperty: keyof IUser & string,
  foreignIdProperty: string,
  defaultValue: { [k: string]: any }
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
            foreignArrayProperty,
            foreignIdProperty,
            defaultValue,
            doc
          )),
        };
        next();
      }
    )
  );
}
