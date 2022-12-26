import { Request, Response, NextFunction } from "express";
import { Global } from "../../common/enums/helpers/Global";
import { Permission } from "../../common/enums/Permission";
import { config } from "../../config";
import { wrapAsyncMiddleware } from "./wrapper";

const context = require("cls-hooked");

const nameSpace = "global";
const session = context.createNamespace(nameSpace);

export const getContext = (property: Global): any => session.get(property);

export const setContext = (property: Global, value: any): void => {
  session.set(property, value);
};

export const shouldSkipPlugins = (): any => {
  const isDeep = !session.active;
  return !config.server.withDeepPlungin
    ? isDeep || getContext(Global.SKIP_PLUGINS)
    : getContext(Global.SKIP_PLUGINS);
};

export const runWithContext = (callBack: any) =>
  session.runAndReturn(() => {
    setContext(Global.SKIP_PLUGINS, false);
    return callBack();
  });

export const runWithContextMiddleWare = () =>
  wrapAsyncMiddleware(
    async (_req: Request, _res: Response, next: NextFunction) =>
      runWithContext(next)
  );

export const isDirector = () =>
  getContext(Global.USER).permission === Permission.DIRECTOR ||
  getContext(Global.USER).permission === Permission.ADMIN;
