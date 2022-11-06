import { Request, Response, NextFunction } from "express";
import { Global } from "../enums/helpers/Global";
import { Permission } from "../enums/Permission";
import { IUser } from "../interfaces/user.interface";
import { AuthenticationError, PermissionError } from "./errors/generalError";
import { setContext } from "./helpers/context";
import { wrapAsyncMiddleware } from "./helpers/wrapper";
import { UsersRPCService } from "./rpc/services/user.RPCservice";

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

    setContext(Global.USERID, user.id);
    setContext(Global.PERMISSION, user.permission);

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
