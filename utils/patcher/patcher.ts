/* eslint-disable no-param-reassign */
import { Request, Response, NextFunction } from "express";
import { IUser } from "../../interfaces/user.interface";
import { wrapAsyncMiddleware } from "../helpers/wrapper";

export const patchResponse = (patchFunction: any, options: any) =>
  wrapAsyncMiddleware(
    async (
      req: Request & { user?: IUser },
      res: Response,
      next: NextFunction
    ) => {
      res = patchFunction(res, options);
      next();
    }
  );
