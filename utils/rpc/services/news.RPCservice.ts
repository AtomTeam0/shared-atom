import * as jayson from "jayson/promise";
import { config } from "../../../config";
import { RPCClientRequest } from "../rpc.functions";

export class NewsRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: config.rpc.newsService.rpcHostname,
    port: config.rpc.newsService.rpcPort,
  });

  static async updateSocketRoom(
    joinRoomId: string,
    leaveRoomId: string
  ): Promise<void> {
    return RPCClientRequest(NewsRPCService.rpcClient, "updateSocketRoom", {
      joinRoomId,
      leaveRoomId,
    });
  }
}
