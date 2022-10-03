import * as jayson from "jayson/promise";
import { RPCconfig } from "../rpc.config";
import { IUser } from "../../../interfaces/user.interface";
import { RPCClientRequest } from "../rpc.functions";

export class UsersRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: RPCconfig.userService.rpcHostname,
    port: RPCconfig.userService.rpcPort,
  });

  static async getUserById(): Promise<IUser> {
    return RPCClientRequest(UsersRPCService.rpcClient, "getUserById");
  }

  static async getUserByIdMaintainDepth(): Promise<IUser> {
    return RPCClientRequest(
      UsersRPCService.rpcClient,
      "getUserById",
      undefined,
      false
    );
  }

  static async getAmountOfUsers(): Promise<number> {
    return RPCClientRequest(UsersRPCService.rpcClient, "getAmountOfUsers");
  }

  static async addLastWatched(itemId: string): Promise<IUser> {
    return RPCClientRequest(UsersRPCService.rpcClient, "addLastWatched", {
      itemId,
    });
  }
}
