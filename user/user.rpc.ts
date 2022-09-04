import { RPCconfig } from "../rpc.config";
import { IUser } from "../interfaces/user.interface";
import { RPCRequest } from "../utils/rpc";

export class UsersRPCService {
  static rpcHostname = RPCconfig.userService.rpcHostname;

  static rpcPort = RPCconfig.userService.rpcPort;

  static async getById(userId: string): Promise<IUser> {
    return RPCRequest(
      UsersRPCService.rpcHostname,
      UsersRPCService.rpcPort,
      "getById",
      {
        userId,
      }
    );
  }
}
