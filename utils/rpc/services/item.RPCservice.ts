import * as jayson from "jayson/promise";
import { ContentType } from "../../../enums/ContentType";
import { IArea } from "../../../interfaces/area.interface";
import { IItem } from "../../../interfaces/item.interface";
import { RPCconfig } from "../rpc.config";
import { RPCClientRequest } from "../rpc.functions";

export class ItemRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: RPCconfig.itemService.rpcHostname,
    port: RPCconfig.itemService.rpcPort,
  });

  static async getItemById(itemId: string): Promise<IItem> {
    return RPCClientRequest()(ItemRPCService.rpcClient, "getItemById", {
      itemId,
    });
  }

  static async createMissionItem(
    title: string,
    contentType: ContentType
  ): Promise<IItem> {
    return RPCClientRequest()(ItemRPCService.rpcClient, "createMissionItem", {
      title,
      contentType,
    });
  }

  static async getAreaById(areaId: string): Promise<IArea> {
    return RPCClientRequest()(ItemRPCService.rpcClient, "getAreaById", {
      areaId,
    });
  }

  static async getRelevantArea(coordinate: number[]): Promise<IArea> {
    return RPCClientRequest()(ItemRPCService.rpcClient, "getRelevantArea", {
      coordinate,
    });
  }
}
