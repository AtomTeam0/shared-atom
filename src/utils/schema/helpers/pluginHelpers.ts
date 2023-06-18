import * as mongoose from "mongoose";
import { Global } from "common-atom/enums/helpers/Global";
import { getContext, shouldSkipPlugins } from "../../helpers/context";

export enum Plugins {
  AGGREGATE = "aggregate_plugin",
  BLOB = "blob_plugin",
  INDEX = "index_plugin",
  POPULATE = "populate_plugin",
  SOCKET = "socket_plugin",
}

export const genericPreMiddleware = (
  schema: mongoose.Schema,
  methods: string[],
  func: (thisObject: any) => Promise<void>,
  funcType: Plugins
) => {
  methods.map((method: string) =>
    schema.pre(
      method,
      async function (this: any, next: (err?: mongoose.CallbackError) => void) {
        if (!shouldSkipPlugins(funcType)) {
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
  func: (thisObject: any, res: any) => Promise<void>,
  funcType: Plugins
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
        if (!shouldSkipPlugins(funcType, (this as any).skipPlugins) && !!res) {
          await func(this, res);
        }
        next();
      }
    )
  );
};
