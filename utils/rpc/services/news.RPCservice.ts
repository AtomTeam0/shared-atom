import * as jayson from "jayson/promise";
import { RPCconfig } from "../rpc.config";
import { RPCClientRequest } from "../rpc.functions";

export class NewsRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: RPCconfig.newsService.rpcHostname,
    port: RPCconfig.newsService.rpcPort,
  });

  static async updateSocketRoom(
    joinRoomId: string,
    leaveRoomId: string
  ): Promise<void> {
    return RPCClientRequest()(NewsRPCService.rpcClient, "updateSocketRoom", {
      joinRoomId,
      leaveRoomId,
    });
  }
}
