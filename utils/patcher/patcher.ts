import { Global } from "../../enums/helpers/Global";
import { IUser } from "../../interfaces/user.interface";
import { getContext } from "../helpers/context";

export function patchDocsWithObject<T>(
  docs: T | T[],
  options: {
    foreignArrayProperty: keyof IUser;
    foreignIdProperty: keyof IUser;
    defaultValue: { [k: string]: any };
  }
): T | T[] {
  const userPatcher = (
    foreignArrayProperty: keyof IUser,
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

  const isArray = Array.isArray(docs);
  const res = (isArray ? docs : [docs]).map((doc: any) => ({
    ...doc,
    ...enhanceProperties(doc),
  }));
  return isArray ? res : res[0];
}

export function patchDocsWithBoolean<T>(
  docs: T | T[],
  options: {
    foreignArrayProperty: keyof IUser;
    localBoolProperty: keyof T;
    defaultValue: boolean;
  }
): T | T[] {
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

  const isArray = Array.isArray(docs);
  const res = (isArray ? docs : [docs]).map((doc: any) => ({
    ...doc,
    ...enhanceBooleanProperty(doc),
  }));
  return isArray ? res : res[0];
}
