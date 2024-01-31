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

// changes the skip plugins context value for each plugin
// [] = skip none; undefined = skip all;
export const putSkipPlugins = (pluginsToSkip?: Plugins[]) => {
  if (!pluginsToSkip) session.set(Global.SKIP_PLUGINS, Object.values(Plugins));
  else session.set(Global.SKIP_PLUGINS, pluginsToSkip);
};

// answers if a certain plugin should be skiped
export const shouldSkipPlugins = (
  funcType: Plugins,
  alternativeValue?: Plugins[]
): any => {
  const isDeep = !session.active;
  const skip = getContext(Global.SKIP_PLUGINS);
  const val =
    // eslint-disable-next-line no-nested-ternary
    alternativeValue !== undefined
      ? alternativeValue.includes(funcType)
      : skip
      ? skip.includes(funcType)
      : true;
  return config.server.withDeepPlugin ? val : isDeep || val;
};

// give a certain scope context capabilities
export const runWithContext = (callBack: any) =>
  session.runAndReturn(() => callBack());

// give a certain scope context capabilities using middleware
export const runWithContextMiddleWare = () =>
  wrapAsyncMiddleware(
    async (_req: Request, _res: Response, next: NextFunction) =>
      runWithContext(() => {
        putSkipPlugins([]);
        return next();
      })
  );

// does the current user have director permission or above
export const isDirector = () =>
  getContext(Global.USER).permission === Permission.DIRECTOR ||
  getContext(Global.USER).permission === Permission.ADMIN;

// does the current user have editor permission or above
export const isEditor = () =>
  getContext(Global.USER).permission === Permission.EDITOR || isDirector();


// preserve context for certain middlewares like multer
export const preserveContextMiddleware = (func:Function) =>
    (req: Request, res: Response, next: NextFunction) => func.call(this, req, res, session.bind(next));
