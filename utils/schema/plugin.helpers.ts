import { Permission } from "../../enums/Permission";

export const initPluginUsage = (
  resetDepth: boolean,
  userId?: string,
  permission?: Permission
): void => {
  if (resetDepth) {
    (<any>global).depth = 1;
  }
  if (userId) {
    (<any>global).userId = userId;
  }
  if (permission) {
    (<any>global).permission = permission;
  }
};
