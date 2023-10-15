import * as jayson from "jayson/promise";
import { IUser, IUserAuthUpdater } from "common-atom/interfaces/user.interface";
import { config } from "../../../config";
import { RPCClientRequest } from "../rpc.functions";

export class UsersRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: config.rpc.userService.rpcHostname,
    port: config.rpc.userService.rpcPort,
  });

  static async getAmountOfUsers(): Promise<number> {
    return RPCClientRequest(UsersRPCService.rpcClient, "getAmountOfUsers");
  }

  static async addLastWatched(itemId: string): Promise<IUser> {
    return RPCClientRequest(UsersRPCService.rpcClient, "addLastWatched", {
      itemId,
    });
  }

  static async getUserById(userId: string): Promise<IUser> {
    return RPCClientRequest(UsersRPCService.rpcClient, "getUserById", {
      userId,
    });
  }
}
