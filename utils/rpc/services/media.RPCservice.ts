import * as jayson from "jayson/promise";
import { config } from "../../../config";
import { IInfographic } from "../../../interfaces/infographic.interface";
import { IMedia } from "../../../interfaces/media.interface";
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
      false
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
      false
    );
  }
}
