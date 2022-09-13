import * as jayson from "jayson/promise";
import { RPCconfig } from "../rpc.config";
import { IUser } from "../../../interfaces/user.interface";
import { RPCClientRequest } from "../rpc.functions";

export class UsersRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: RPCconfig.userService.rpcHostname,
    port: RPCconfig.userService.rpcPort,
  });

  static async getById(): Promise<IUser> {
    return RPCClientRequest(UsersRPCService.rpcClient, "getById");
  }
}