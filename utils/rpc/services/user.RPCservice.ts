import * as jayson from "jayson/promise";
import { config } from "../../../config";
import { IUser, IUserAuthUpdater } from "../../../common/interfaces/user.interface";
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

  static async updateUser(
    userId: string,
    dataToUpdate: IUserAuthUpdater
  ): Promise<IUser> {
    return RPCClientRequest(UsersRPCService.rpcClient, "updateUser", {
      userId,
      dataToUpdate,
    });
  }
}
