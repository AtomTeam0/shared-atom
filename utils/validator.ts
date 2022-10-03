import { Request, Response, NextFunction } from "express";
import { Permission } from "../enums/Permission";
import { IUser } from "../interfaces/user.interface";
import { AuthenticationError, PermissionError } from "./errors/generalError";
import {
  IdArrayNotFoundError,
  IdNotFoundError,
} from "./errors/validationError";
import { wrapAsyncMiddleware } from "./helpers/wrapper";
import { UsersRPCService } from "./rpc/services/user.RPCservice";
import { initPluginUsage } from "./schema/plugin.helpers";

export const idExistsInDb = async (
  id: any | undefined,
  getFunction: (id: string) => Promise<any>
) => {
  const isString = (value: unknown) => typeof value === "string";

  if (id) {
    if (!isString(id)) {
      throw new IdNotFoundError(getFunction.name);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { depth } = <any>global;

    const result = await getFunction(id);
    if (!result) {
      throw new IdNotFoundError(getFunction.name);
    }

    (<any>global).depth = depth;
    return result;
  }
  return undefined;
};

export const idArrayExistsInDb = async (
  idArray: any[] | undefined,
  getFunction: (id: string) => Promise<any>
) => {
  const isNonEmptyArrayOfStrings = (value: unknown): value is string[] =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string");

  if (idArray) {
    if (!isNonEmptyArrayOfStrings(idArray)) {
      throw new IdArrayNotFoundError(getFunction.name);
    }
    const results = await Promise.all(
      idArray.map(async (id: string) => getFunction(id))
    );
    if (results.some((result: any) => !result)) {
      throw new IdArrayNotFoundError(getFunction.name);
    }

    return results;
  }
  return undefined;
};

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

    initPluginUsage(true, user.id, user.permission);

    try {
      await idExistsInDb(user.id, UsersRPCService.getUserById);
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
