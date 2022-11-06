import { Request, Response, NextFunction } from "express";
import { Global } from "../../enums/helpers/Global";
import { wrapAsyncMiddleware } from "./wrapper";

const context = require("continuation-local-storage");

const nameSpace = "global";
const session = context.createNamespace(nameSpace);

export const getContext = (property: Global): any => session.get(property);

export const setContext = (property: Global, value: any): void => {
  session.set(property, value);
};

export const runWithContextMiddleWare = () =>
  wrapAsyncMiddleware(
    async (_req: Request, _res: Response, next: NextFunction) =>
      session.runAndReturn(() => {
        setContext(Global.SKIP_PLUGINS, false);
        next();
      })
  );

export const runWithContext = (callBack: any) => session.runAndReturn(callBack);
