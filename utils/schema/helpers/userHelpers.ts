import { Global } from "../../../enums/helpers/Global";
import { IUser } from "../../../interfaces/user.interface";
import { UsersRPCService } from "../../rpc/services/user.RPCservice";

const contextService = require("request-context");

export const getUserArray = async (
  foreignArrayProperty: keyof IUser & string
): Promise<Array<any[]>> => {
  const user = await UsersRPCService.getUserById(
    contextService.get(Global.USERID)
  );
  if (!user) {
    return [];
  }
  return user[foreignArrayProperty] as any[];
};

export const userPatcher = async (
  foreignArrayProperty: keyof IUser & string,
  foreignIdProperty: string,
  localId: string
): Promise<any> => {
  const array = await getUserArray(foreignArrayProperty);
  const obj = array.find((item: any) => item[foreignIdProperty] === localId);
  if (obj) {
    delete (obj as any)[foreignIdProperty];
  }
  return obj;
};

export const userPatcherBoolean = async (
  foreignArrayProperty: keyof IUser & string,
  localId: string
): Promise<any> => {
  const array = await getUserArray(foreignArrayProperty);
  const doesExist = array.some((id: any) => id === localId);
  return doesExist;
};
