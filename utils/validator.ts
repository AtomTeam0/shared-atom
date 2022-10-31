import { Request, Response, NextFunction } from "express";
import { Permission } from "../enums/Permission";
import { IUser } from "../interfaces/user.interface";
import { AuthenticationError, PermissionError } from "./errors/generalError";
import { wrapAsyncMiddleware } from "./helpers/wrapper";
import { UsersRPCService } from "./rpc/services/user.RPCservice";
import { initPluginUsage } from "./schema/helpers/pluginHelpers";

export const validateUserAndPermission = (
  permissions: Permission[] = [...Object.values(Permission)]
) => {
  const permissionValidator = async (
    user: IUser | undefined,
    permissionsToValidate: Permission[]
  ) => {
    if (!user || !user.id) {
      return new AuthenticationError();
    }

    if (
      !user.permission ||
      ![Permission.ADMIN, ...permissionsToValidate].includes(user.permission)
    ) {
      return new PermissionError();
    }

    initPluginUsage(user.id, user.permission);

    try {
      await UsersRPCService.getUserById(user.id);
    } catch (err) {
      return err;
    }

    return undefined;
  };

  return wrapAsyncMiddleware(
    async (req: Request, _res: Response, next: NextFunction) => {
      const error = await permissionValidator((req as any).user, permissions);
      if (error) {
        throw error;
      }
      next();
    }
  );
};
