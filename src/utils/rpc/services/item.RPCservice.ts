import { Client } from "jayson/promise";
import { IItem } from "common-atom/interfaces/item.interface";
import { IUnit } from "common-atom/interfaces/unit.interface";
import { config } from "../../../config";
import { RPCClientRequest } from "../rpc.functions";

export class ItemRPCService {
  private static rpcClient = Client.http({
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

  static async createItem(item: IItem): Promise<IItem> {
    return RPCClientRequest(ItemRPCService.rpcClient, "createItem", {
      item,
    });
  }

  static async getUnitById(unitId: string): Promise<IUnit> {
    return RPCClientRequest(ItemRPCService.rpcClient, "getUnitById", {
      unitId,
    });
  }
}
