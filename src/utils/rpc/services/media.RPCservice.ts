import * as jayson from "jayson/promise";
import { IInfographic } from "common-atom/interfaces/infographic.interface";
import { IMedia } from "common-atom/interfaces/media.interface";
import { config } from "../../../config";
import { RPCClientRequest } from "../rpc.functions";

export class MediaRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: config.rpc.mediaService.rpcHostname,
    port: config.rpc.mediaService.rpcPort,
  });

  static async getMediaById(mediaId: string): Promise<IMedia> {
    return RPCClientRequest(
      MediaRPCService.rpcClient,
      "getMediaById",
      {
        mediaId,
      },
      []
    );
  }

  static async getInfographicById(
    infographicId: string
  ): Promise<IInfographic> {
    return RPCClientRequest(
      MediaRPCService.rpcClient,
      "getInfographicById",
      {
        infographicId,
      },
      []
    );
  }
}
