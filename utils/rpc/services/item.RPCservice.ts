import * as jayson from "jayson/promise";
import { config } from "../../../config";
import { ContentType } from "../../../common/enums/ContentType";
import { IArea } from "../../../common/interfaces/area.interface";
import { IItem } from "../../../common/interfaces/item.interface";
import { RPCClientRequest } from "../rpc.functions";
import { IUnit } from "../../../common/interfaces/unit.interface";

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

  static async createItem(item: IItem): Promise<IItem> {
    return RPCClientRequest(ItemRPCService.rpcClient, "createItem", {
      item,
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

  static async getUnitById(unitId: string): Promise<IUnit> {
    return RPCClientRequest(ItemRPCService.rpcClient, "getUnitById", {
      unitId,
    });
  }
}
