import { Permission } from "common-atom/enums/Permission";
import { Global } from "common-atom/enums/helpers/Global";
import { NextFunction, Request, Response } from "express";
import { ITokenPayload } from "passport-azure-ad";
import { generateUnauthorizedError } from "../errors/applicationError";
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
    // validate user property preferred_username
    if (!user || !user.preferred_username) {
      return generateUnauthorizedError(
        "Authentication Error- Missing preferred_username"
      );
    }
    // validate user property name
    if (!user || !user.name) {
      return generateUnauthorizedError(
        "Authentication Error- Missing user.name"
      );
    }

    let userFromDb;
    try {
      // extract personal ID from preferred_username
      const personalId = user.preferred_username.split("@")[0];
      userFromDb = await UsersRPCService.getUserById(personalId);
      // set current user in the context
      setContext(Global.USER, userFromDb);
    } catch (err) {
      return err;
    }

    // check if user has permission for this particular route
    if (
      !userFromDb ||
      !userFromDb.permission ||
      ![Permission.ADMIN, ...permissionsToValidate].includes(
        userFromDb.permission
      )
    ) {
      return generateUnauthorizedError(
        `Invalid Permission- Required permissions: ${permissionsToValidate} users permissions: ${userFromDb.permission}`
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
