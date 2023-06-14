import { Request, Response, NextFunction } from "express";
import { ITokenPayload } from "passport-azure-ad";
import { AccountInfo } from "@azure/msal-node";
import { Global } from "common-atom/enums/helpers/Global";
import { Permission } from "common-atom/enums/Permission";
import { AuthenticationError, PermissionError } from "../errors/generalError";
import { setContext } from "../helpers/context";
import { wrapAsyncMiddleware } from "../helpers/wrapper";
import { UsersRPCService } from "../rpc/services/user.RPCservice";
import { config } from "../../config";

export const validateUserAndPermission = (
  permissions: Permission[] = [...Object.values(Permission)]
) => {
  const permissionValidator = async (
    user: AccountInfo | undefined,
    permissionsToValidate: Permission[]
  ) => {
    if (!user || !user.username) {
      return new AuthenticationError('Missing username');
    }
    if (!user || !user.name) {
      return new AuthenticationError('Missing user.name');
    }

    let userFromDb;
    try {
      const personalId = user.username.split("@")[0];
      userFromDb = await UsersRPCService.updateUser(personalId, {
        name: user.name
      });
      setContext(Global.USER, userFromDb);
    } catch (err) {
      return err;
    }

    if (
      !userFromDb ||
      !userFromDb.permission ||
      ![Permission.ADMIN, ...permissionsToValidate].includes(
        userFromDb.permission
      )
    ) {
      return new PermissionError();
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
