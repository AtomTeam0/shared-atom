import * as jayson from "jayson/promise";
import { config } from "../../../config";
import { ContentType } from "../../../enums/ContentType";
import { IArea } from "../../../interfaces/area.interface";
import { IItem } from "../../../interfaces/item.interface";
import { RPCClientRequest } from "../rpc.functions";

export class ItemRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: config.rpc.itemService.rpcHostname,
    port: config.rpc.itemService.rpcPort,
  });

  static async getItemById(itemId: string): Promise<IItem> {
    return RPCClientRequest(ItemRPCService.rpcClient, "getItemById", {
      itemId,
    });
  }

  static async createMissionItem(
    title: string,
    contentType: ContentType,
    priority?: number
  ): Promise<IItem> {
    return RPCClientRequest(ItemRPCService.rpcClient, "createMissionItem", {
      title,
      contentType,
      priority,
    });
  }

  static async getAreaById(areaId: string): Promise<IArea> {
    return RPCClientRequest(ItemRPCService.rpcClient, "getAreaById", {
      areaId,
    });
  }

  static async getRelevantArea(coordinate: number[]): Promise<IArea> {
    return RPCClientRequest(ItemRPCService.rpcClient, "getRelevantArea", {
      coordinate,
    });
  }
}
