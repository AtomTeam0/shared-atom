import { IUser, userAmountObject } from "common-atom/interfaces/user.interface";
import { Client } from "jayson/promise";
import { config } from "../../../config";
import { RPCClientRequest } from "../rpc.functions";

export class UsersRPCService {
  private static rpcClient = Client.http({
    hostname: config.rpc.userService.rpcHostname,
    port: config.rpc.userService.rpcPort,
  });

  static async getUserById(userId: string): Promise<IUser> {
    return RPCClientRequest(UsersRPCService.rpcClient, "getUserById", {
      userId,
    });
  }

  static async getAmountOfUsers(): Promise<userAmountObject> {
    return RPCClientRequest(UsersRPCService.rpcClient, "getAmountOfUsers");
  }
}