import { Request, Response, NextFunction } from "express";
import { Permission } from "../enums/Permission";
import { IUser } from "../interfaces/user.interface";
import { AuthenticationError, PermissionError } from "./errors/generalError";

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
      !permissions.includes(user.permission)
    ) {
      return new PermissionError();
    }

    contextService.set("userId", user.id);
    return undefined;
  }
}
