import { CallbackError, Query, Schema } from "mongoose";
import { Global } from "common-atom/enums/helpers/Global";
import { Plugins } from "common-atom/enums/Plugins";
import { getContext, shouldSkipPlugins } from "../../helpers/context";

// a generic middleware for inside a plugin witch triggers before the DB operation (Pre)
export const genericPreMiddleware = (
  schema: Schema,
  methods: string[],
  func: (thisObject: any) => Promise<void>,
  funcType: Plugins
) => {
  methods.map((method: string) =>
    schema.pre(
      method,
      async function (this: any, next: (err?: CallbackError) => void) {
        if (!shouldSkipPlugins(funcType)) {
          await func(this);
        }
        next();
      }
    )
  );
};

// a generic middleware for inside a plugin witch triggers after the DB operation (Post)
export const genericPostMiddleware = (
  schema: Schema,
  methods: string[],
  func: (thisObject: any, res: any) => Promise<void>,
  funcType: Plugins
) => {
  methods.map((method: string) =>
    schema.pre(
      method,
      async function (
        this: Query<any, any>,
        next: (err?: CallbackError) => void
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
        this: Query<any, any>,
        res: any,
        next: (err?: CallbackError) => void
      ) {
        if (!shouldSkipPlugins(funcType, (this as any).skipPlugins) && !!res) {
          await func(this, res);
        }
        next();
      }
    )
  );
};
