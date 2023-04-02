import { Request, Response, NextFunction } from "express";
import * as context from "cls-hooked";
import { Global } from "common-atom/enums/helpers/Global";
import { Permission } from "common-atom/enums/Permission";
import { config } from "../../config";
import { wrapAsyncMiddleware } from "./wrapper";

const nameSpace = "global";
const session = context.createNamespace(nameSpace);

export const getContext = (property: Global): any => session.get(property);

export const setContext = (property: Global, value: any): void => {
  session.set(property, value);
};

export const shouldSkipPlugins = (alternativeValue?: boolean): any => {
  const isDeep = !session.active;
  const val =
    alternativeValue !== undefined
      ? alternativeValue
      : getContext(Global.SKIP_PLUGINS);
  return config.server.withDeepPlugin ? val : isDeep || val;
};

export const runWithContext = (callBack: any) =>
  session.runAndReturn(() => callBack());

export const runWithContextMiddleWare = () =>
  wrapAsyncMiddleware(
    async (_req: Request, _res: Response, next: NextFunction) =>
      runWithContext(() => {
        setContext(Global.SKIP_PLUGINS, false);
        return next();
      })
  );

export const isDirector = () =>
  getContext(Global.USER).permission === Permission.DIRECTOR ||
  getContext(Global.USER).permission === Permission.ADMIN;