import { Request, Response, NextFunction } from "express";
import { Global } from "common-atom/enums/helpers/Global";
import { Permission } from "common-atom/enums/Permission";
import { AuthenticationError, PermissionError } from "../errors/generalError";
import { setContext } from "../helpers/context";
import { wrapAsyncMiddleware } from "../helpers/wrapper";
import { UsersRPCService } from "../rpc/services/user.RPCservice";
import { ITokenPayload } from "passport-azure-ad";

export const validateUserAndPermission = (
  permissions: Permission[] = [...Object.values(Permission)]
) => {
  const permissionValidator = async (
    user: ITokenPayload | undefined,
    permissionsToValidate: Permission[]
  ) => {
    if (!user || !user.preferred_username) {
      return new AuthenticationError("Missing preferred_username");
    }
    if (!user || !user.name) {
      return new AuthenticationError("Missing user.name");
    }

    let userFromDb;
    try {
      const personalId = user.preferred_username.split("@")[0];
      userFromDb = await UsersRPCService.updateUser(personalId, {
        name: user.name,
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
      return new PermissionError(
        `Required permissions: ${permissionsToValidate} users permissions: ${userFromDb.permission}`
      );
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
