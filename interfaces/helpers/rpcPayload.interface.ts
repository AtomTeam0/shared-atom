import { Permission } from "../../enums/Permission";

export interface IRPCPayload {
  userId?: string;
  permission?: Permission;
  params?: { [k: string]: any };
}
