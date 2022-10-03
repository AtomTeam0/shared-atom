import { Permission } from "../../enums/Permission";

export const initPluginUsage = (
  userId?: string,
  permission?: Permission
): void => {
  if (userId) {
    (<any>global).userId = userId;
  }
  if (permission) {
    (<any>global).permission = permission;
  }
  (<any>global).deepness = 1;
};
