import { IUser } from "../../interfaces/user.interface";
import { UsersRPCService } from "../RPC/services/user.RPCservice";

export const userPatcher = async (
  foreignArrayProperty: keyof IUser & string,
  foreignIdProperty: string,
  defaultValue: { [k: string]: any },
  localObjToPatch: { id: string; [k: string]: any }
): Promise<any> => {
  const user = await UsersRPCService.getById();
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
  foreignArrayProperty: keyof IUser & string,
  localboolProperty: string,
  defaultValue: boolean,
  localObjToPatch: { id: string; [k: string]: any }
): Promise<any> => {
  const user = await UsersRPCService.getById();
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
