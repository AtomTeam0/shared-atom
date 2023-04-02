import * as jayson from "jayson/promise";
import { ContentType } from "common-atom/enums/ContentType";
import { IArea } from "common-atom/interfaces/area.interface";
import { IItem } from "common-atom/interfaces/item.interface";
import { IUnit } from "common-atom/interfaces/unit.interface";
import { config } from "../../../config";
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

  static async getItemByContentId(contentId: string): Promise<IItem> {
    return RPCClientRequest(ItemRPCService.rpcClient, "getItemByContentId", {
      contentId,
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

  static async getAreas(): Promise<IArea[]> {
    return RPCClientRequest(ItemRPCService.rpcClient, "getAreas");
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
