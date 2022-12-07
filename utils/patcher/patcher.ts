import { Global } from "../../common/enums/helpers/Global";
import { IUser } from "../../common/interfaces/user.interface";
import { getContext } from "../helpers/context";

export function patchDocsWithObject<T>(
  docs: T | T[],
  options: {
    foreignArrayProperty: keyof IUser;
    foreignIdProperty: keyof IUser;
    defaultValue: { [k: string]: any };
  },
  isLean = false
): T | T[] {
  if (getContext(Global.SKIP_PLUGINS)) {
    return docs;
  }
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
    ...(isLean ? doc : (doc as any)._doc),
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
  },
  isLean = false
): T | T[] {
  if (getContext(Global.SKIP_PLUGINS)) {
    return docs;
  }
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
    ...(isLean ? doc : (doc as any)._doc),
    ...enhanceBooleanProperty(doc),
  }));
  return isArray ? res : res[0];
}
