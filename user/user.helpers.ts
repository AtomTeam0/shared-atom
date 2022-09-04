import { IUser } from "../interfaces/user.interface";
import { UsersRPCService } from "./user.rpc";

export const userPatcher = async (
  userId: string,
  foreignArrayProperty: keyof IUser & string,
  foreignIdProperty: string,
  localObjToPatch: { id: string; [k: string]: any },
  defaultValue: { [k: string]: any }
): Promise<any> => {
  const user = await UsersRPCService.getById(userId);
  if (!user) {
    return defaultValue;
  }
  const array = user[foreignArrayProperty] as Array<any>;
  const obj = array.find(
    (item: any) => item[foreignIdProperty] === localObjToPatch.id
  );
  delete obj[foreignIdProperty];
  return {
    ...localObjToPatch,
    ...(obj || defaultValue),
  };
};

export const userPatcherBooleanCheck = async (
  userId: string,
  foreignArrayProperty: keyof IUser & string,
  localboolProperty: string,
  localObjToPatch: { id: string; [k: string]: any },
  defaultValue: boolean
): Promise<any> => {
  const user = await UsersRPCService.getById(userId);
  if (!user) {
    return defaultValue;
  }
  const array = user[foreignArrayProperty] as Array<string>;
  const doesExist = array.some((id: any) => id === localObjToPatch.id);
  return {
    ...localObjToPatch,
    [localboolProperty]: doesExist || defaultValue,
  };
};
