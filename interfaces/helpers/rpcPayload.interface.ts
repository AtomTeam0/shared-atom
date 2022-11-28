import { IUser } from "../user.interface";

export interface IRPCPayload {
  user?: IUser;
  params?: { [k: string]: any };
  skipPlugins: boolean;
}
