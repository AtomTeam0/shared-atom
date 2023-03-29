import { Request, Response, NextFunction } from "express";
import { ITokenPayload } from "passport-azure-ad";
import { Global } from "../../common/enums/helpers/Global";
import { Permission } from "../../common/enums/Permission";
import { AuthenticationError, PermissionError } from "../errors/generalError";
import { setContext } from "../helpers/context";
import { wrapAsyncMiddleware } from "../helpers/wrapper";
import { UsersRPCService } from "../rpc/services/user.RPCservice";

export const validateUserAndPermission = (
  permissions: Permission[] = [...Object.values(Permission)]
) => {
  const permissionValidator = async (
    user: ITokenPayload | undefined,
    permissionsToValidate: Permission[]
  ) => {
    if (!user || !user.upn) {
      return new AuthenticationError();
    }

    let userFromDb;
    try {
      const personalId = user.upn.split("@")[0];
      console.log(user.given_name);
      console.log(user.family_name);
      userFromDb = await UsersRPCService.updateUser(personalId, {
        firstName: user.given_name,
        lastName: user.family_name,
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
