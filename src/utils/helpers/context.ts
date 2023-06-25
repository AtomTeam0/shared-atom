import { Request, Response, NextFunction } from "express";
import * as context from "cls-hooked";
import { Global } from "common-atom/enums/helpers/Global";
import { Permission } from "common-atom/enums/Permission";
import { Plugins } from "common-atom/enums/Plugins";
import { config } from "../../config";
import { wrapAsyncMiddleware } from "./wrapper";

const nameSpace = "global";
const session = context.createNamespace(nameSpace);

export const getContext = (property: Global): any => session.get(property);

export const setContext = (property: Global, value: any): void => {
  session.set(property, value);
};

export const putSkipPlugins = (pluginsToSkip?: Plugins[]) => {
  if (!pluginsToSkip) session.set(Global.SKIP_PLUGINS, Object.values(Plugins));
  else session.set(Global.SKIP_PLUGINS, pluginsToSkip);
};

export const shouldSkipPlugins = (
  funcType: Plugins,
  alternativeValue?: boolean
): any => {
  const isDeep = !session.active;
  const skip = getContext(Global.SKIP_PLUGINS);
  const val =
    // eslint-disable-next-line no-nested-ternary
    alternativeValue !== undefined
      ? alternativeValue
      : skip?.includes(funcType) || false;
  return config.server.withDeepPlugin ? val : isDeep || val;
};

export const runWithContext = (callBack: any) =>
  session.runAndReturn(() => callBack());

export const runWithContextMiddleWare = () =>
  wrapAsyncMiddleware(
    async (_req: Request, _res: Response, next: NextFunction) =>
      runWithContext(() => {
        putSkipPlugins([]);
        return next();
      })
  );

export const isDirector = () =>
  getContext(Global.USER).permission === Permission.DIRECTOR ||
  getContext(Global.USER).permission === Permission.ADMIN;
