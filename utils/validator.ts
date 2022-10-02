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
import { initPluginUsage, setPluginUsage } from "./schema/plugin.helpers";

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
    const { userId, ...pluginGlobal } = <any>global;
    setPluginUsage({
      skipCondition: true,
      skipPopulate: true,
      skipPatch: true,
    });

    const result = await getFunction(id);
    if (!result) {
      throw new IdNotFoundError(getFunction.name);
    }

    setPluginUsage({ ...pluginGlobal });
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
    (<any>global).userId = user.id;
    initPluginUsage();

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
