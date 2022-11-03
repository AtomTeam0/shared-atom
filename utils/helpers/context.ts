import * as express from "express";
import { Global } from "../../enums/helpers/Global";

const context = require("node-execution-context");

export const contextMiddleware = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  context.run(next, {});
};

export const createContext = (
  defaultVal: Partial<Record<Global, unknown>> = {}
) => {
  context.create(defaultVal);
};

export const getContext = (property: Global): any => context.get()[property];

export const setContext = (obj: Partial<Record<Global, unknown>>): void => {
  context.set({ ...context.get(), ...obj });
};
