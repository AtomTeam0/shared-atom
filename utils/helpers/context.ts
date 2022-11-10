import { Request, Response, NextFunction } from "express";
import { Global } from "../../enums/helpers/Global";
import { wrapAsyncMiddleware } from "./wrapper";

const context = require("cls-hooked");

const nameSpace = "global";
const session = context.createNamespace(nameSpace);

export const getContext = (property: Global): any => session.get(property);

export const setContext = (property: Global, value: any): void => {
  session.set(property, value);
};

export const runWithContext = (callBack: any) =>
  session.runAndReturn(() => {
    setContext(Global.SKIP_PLUGINS, false);
    setContext(Global.DEPTH, 1);
    return callBack();
  });

export const runWithContextMiddleWare = () =>
  wrapAsyncMiddleware(
    async (_req: Request, _res: Response, next: NextFunction) =>
      runWithContext(next)
  );