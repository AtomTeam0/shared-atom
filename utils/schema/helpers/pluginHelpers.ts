import * as mongoose from "mongoose";
import { Global } from "../../../common/enums/helpers/Global";
import { getContext, shouldSkipPlugins } from "../../helpers/context";

export const genericPreMiddleware = (
  schema: mongoose.Schema,
  methods: string[],
  func: (thisObject: any) => Promise<void>
) => {
  methods.map((method: string) =>
    schema.pre(
      method,
      async function (this: any, next: (err?: mongoose.CallbackError) => void) {
        if (!shouldSkipPlugins()) {
          await func(this);
        }
        next();
      }
    )
  );
};

export const genericPostMiddleware = (
  schema: mongoose.Schema,
  methods: string[],
  func: (thisObject: any, res: any) => Promise<void>
) => {
  methods.map((method: string) =>
    schema.pre(
      method,
      async function (
        this: mongoose.Query<any, any>,
        next: (err?: mongoose.CallbackError) => void
      ) {
        (this as any).skipPlugins = getContext(Global.SKIP_PLUGINS);
        next();
      }
    )
  );
  methods.map((method: string) =>
    schema.post(
      method,
      async function (
        this: mongoose.Query<any, any>,
        res: any,
        next: (err?: mongoose.CallbackError) => void
      ) {
        if (!shouldSkipPlugins((this as any).skipPlugins) && !!res) {
          await func(this, res);
        }
        next();
      }
    )
  );
};
