import { RPCconfig } from "../utils/rpc/rpc.config";
import { IUser } from "../interfaces/user.interface";
import { RPCClientRequest } from "../utils/rpc/rpc";

export class UsersRPCService {
  private static rpcHostname = RPCconfig.userService.rpcHostname;

  private static rpcPort = RPCconfig.userService.rpcPort;

  static async getById(userId: string): Promise<IUser> {
    return RPCClientRequest(
      UsersRPCService.rpcHostname,
      UsersRPCService.rpcPort,
      "getById",
      userId,
      {
        userId,
      }
    );
  }
}
