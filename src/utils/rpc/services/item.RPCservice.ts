import { Client } from "jayson/promise";
import { IItem } from "common-atom/interfaces/item.interface";
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


}