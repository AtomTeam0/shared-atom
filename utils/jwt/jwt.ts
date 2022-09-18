import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { IUser } from "../../interfaces/user.interface";
import { InvalidToken, TokenNotProvided } from "../errors/validationError";
import { wrapAsyncMiddleware } from "../helpers/wrapper";
import { JWTconfig } from "./jwt.config";

export const verifyToken = wrapAsyncMiddleware(
  async (
    req: Request & { user?: IUser },
    _res: Response,
    next: NextFunction
  ) => {
    const autheader = req.headers.authorization;
    const token = autheader && autheader.split(" ")[1];
    if (!token) {
      throw new TokenNotProvided();
    }

    jwt.verify(token, JWTconfig.secretKey, (err: any, user: any) => {
      if (err) {
        throw new InvalidToken();
      }
      req.user = user as IUser;
      next();
    });
  }
);
