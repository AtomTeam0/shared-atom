import { Global } from "../../enums/helpers/Global";

const context = require("node-execution-context");

export const createContext = (
  defaultVal: Partial<Record<Global, unknown>> = {}
) => {
  context.create(defaultVal);
};

export const getContext = (property: Global): any => context.get()[property];

export const setContext = (obj: Partial<Record<Global, unknown>>): void => {
  context.set({ ...context.get(), ...obj });
};
