import { Global } from "../../enums/helpers/Global";
import { IUser } from "../../interfaces/user.interface";
import { getContext } from "../helpers/context";

export function patchDocsWithObject<T>(
  docs: T[],
  options: {
    foreignArrayProperty: keyof IUser & string;
    foreignIdProperty: string;
    defaultValue: { [k: string]: any };
  },
  childProperty?: keyof T
) {
  const userPatcher = (
    foreignArrayProperty: keyof IUser & string,
    foreignIdProperty: string,
    localId: string
  ): Promise<any> => {
    const array = getContext(Global.USER)[foreignArrayProperty];
    const obj = array.find((item: any) => item[foreignIdProperty] === localId);
    if (obj) {
      delete (obj as any)[foreignIdProperty];
    }
    return obj;
  };

  const enhanceProperties = (doc: any) =>
    userPatcher(
      options.foreignArrayProperty,
      options.foreignIdProperty,
      String(doc._id)
    ) || options.defaultValue;

  if (childProperty) {
    return docs.map((doc: any) => ({
      ...doc,
      [childProperty]: doc[childProperty].map((child: any) => ({
        ...child,
        ...enhanceProperties(child),
      })),
    }));
  }
  return docs.map((doc: any) => ({ ...doc, ...enhanceProperties(doc) }));
}

export function patchDocsWithBoolean<T>(
  docs: T[],
  options: {
    foreignArrayProperty: keyof IUser & string;
    localBoolProperty: string;
    defaultValue: boolean;
  },
  childProperty?: keyof T
) {
  const userPatcherBoolean = (
    foreignArrayProperty: keyof IUser & string,
    localId: string
  ): Promise<any> => {
    const array = getContext(Global.USER)[foreignArrayProperty];
    const doesExist = array.some((id: any) => id === localId);
    return doesExist;
  };

  const enhanceBooleanProperty = (doc: any) => ({
    [options.localBoolProperty]:
      userPatcherBoolean(options.foreignArrayProperty, String(doc._id)) ||
      options.defaultValue,
  });

  if (childProperty) {
    return docs.map((doc: any) => ({
      ...doc,
      [childProperty]: doc[childProperty].map((child: any) => ({
        ...child,
        ...enhanceBooleanProperty(child),
      })),
    }));
  }
  return docs.map((doc: any) => ({ ...doc, ...enhanceBooleanProperty(doc) }));
}
