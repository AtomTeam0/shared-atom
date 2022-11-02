import { Global } from "../../../enums/helpers/Global";
import { Permission } from "../../../enums/Permission";

const contextService = require("request-context");

export const initPluginUsage = (
  userId?: string,
  permission?: Permission,
  skipPlugins = false
): void => {
  contextService.set(Global.DEPTH, 1);
  contextService.set(Global.SKIP_PLUGINS, skipPlugins);
  if (userId) {
    contextService.set(Global.USERID, userId);
  }
  if (permission) {
    contextService.set(Global.PERMISSION, permission);
  }
};
