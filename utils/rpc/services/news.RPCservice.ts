import * as jayson from "jayson/promise";
import { AreaNames } from "../../../common/enums/AreaNames";
import { config } from "../../../config";
import { RPCClientRequest } from "../rpc.functions";

export class NewsRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: config.rpc.newsService.rpcHostname,
    port: config.rpc.newsService.rpcPort,
  });

  static async updateSocketRoom(
    joinRoomId: AreaNames,
    leaveRoomId?: AreaNames
  ): Promise<void> {
    return RPCClientRequest(NewsRPCService.rpcClient, "updateSocketRoom", {
      joinRoomId,
      leaveRoomId,
    });
  }
}
