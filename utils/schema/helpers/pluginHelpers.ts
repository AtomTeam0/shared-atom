import { Permission } from "../../enums/Permission";

export const initPluginUsage = (
  userId?: string,
  permission?: Permission,
  skipPlugins = false
): void => {
  (<any>global).depth = 1;
  (<any>global).skipPlugins = skipPlugins;
  if (userId) {
    (<any>global).userId = userId;
  }
  if (permission) {
    (<any>global).permission = permission;
  }
};
