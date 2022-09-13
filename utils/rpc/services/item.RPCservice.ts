import * as jayson from "jayson/promise";
import { IItem } from "../../../interfaces/item.interface";
import { RPCconfig } from "../rpc.config";
import { RPCClientRequest } from "../rpc.functions";

export class ItemRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: RPCconfig.itemService.rpcHostname,
    port: RPCconfig.itemService.rpcPort,
  });

  static async getItemById(itemId: string): Promise<IItem> {
    return RPCClientRequest(ItemRPCService.rpcClient, "getItemById", {
      itemId,
    });
  }
}
