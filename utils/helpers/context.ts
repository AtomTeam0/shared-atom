import { Global } from "../../enums/helpers/Global";

const context = require("continuation-local-storage");

const nameSpace = "global";

export const createContext = () => {
  context.createNamespace(nameSpace);
};

export const getContext = (property: Global): any => {
  const session = context.getNamespace(nameSpace);
  return session && session.get(property);
};

export const setContext = (property: Global, value: any): void => {
  const session = context.getNamespace(nameSpace);
  if (session) {
    session.set(property, value);
  }
};
