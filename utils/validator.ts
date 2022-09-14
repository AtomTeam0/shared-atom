import { Request, Response, NextFunction } from "express";
import { Permission } from "../enums/Permission";
import { IUser } from "../interfaces/user.interface";
import { AuthenticationError, PermissionError } from "./errors/generalError";
import {
  IdArrayNotFoundError,
  IdNotFoundError,
} from "./errors/validationError";

const contextService = require("request-context");

export class Validator {
  static validatePermission(
    permissions: Permission[] = [...Object.values(Permission)]
  ) {
    const middleware = (req: Request, res: Response, next: NextFunction) => {
      next(Validator.permissionValidator((req as any).user, permissions));
    };
    return middleware;
  }

  private static permissionValidator(
    user: IUser | undefined,
    permissions: Permission[]
  ) {
    if (!user || !user.id) {
      return new AuthenticationError();
    }

    if (
      user.permission === undefined ||
      ![permissions, ...Permission.ADMIN].includes(user.permission)
    ) {
      return new PermissionError();
    }

    contextService.set("userId", user.id);
    return undefined;
  }
}

export const idExistsInDb = async (
  id: any | undefined,
  getFunction: (id: string) => Promise<any>,
  propertyName: string
) => {
  const isString = (value: unknown) => typeof value === "string";

  if (id) {
    if (!isString(id)) {
      throw new IdNotFoundError(propertyName);
    }
    const result = await getFunction(id);
    if (!result) {
      throw new IdNotFoundError(propertyName);
    }

    return result;
  }
  return undefined;
};

export const idArrayExistsInDb = async (
  idArray: any[] | undefined,
  getFunction: (id: string) => Promise<any>,
  propertyName: string
) => {
  const isNonEmptyArrayOfStrings = (value: unknown): value is string[] =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string");

  if (idArray) {
    if (!isNonEmptyArrayOfStrings(idArray)) {
      throw new IdArrayNotFoundError(propertyName);
    }
    const results = await Promise.all(
      idArray.map(async (id: string) => getFunction(id))
    );
    if (results.some((result: any) => !result)) {
      throw new IdArrayNotFoundError(propertyName);
    }

    return results;
  }
  return undefined;
};
