import * as jayson from "jayson/promise";
import { IInfographic } from "../../../interfaces/infographic.interface";
import { IMedia } from "../../../interfaces/media.interface";
import { RPCconfig } from "../rpc.config";
import { RPCClientRequest } from "../rpc.functions";

export class MediaRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: RPCconfig.mediaService.rpcHostname,
    port: RPCconfig.mediaService.rpcPort,
  });

  static async getMediaById(mediaId: string): Promise<IMedia> {
    return RPCClientRequest(false)(MediaRPCService.rpcClient, "getMediaById", {
      mediaId,
    });
  }

  static async getInfographicById(
    infographicId: string
  ): Promise<IInfographic> {
    return RPCClientRequest(false)(
      MediaRPCService.rpcClient,
      "getInfographicById",
      {
        infographicId,
      }
    );
  }
}
