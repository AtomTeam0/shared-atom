import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { ITokenPayload } from "passport-azure-ad";
import { Global } from "../../common/enums/helpers/Global";
import { config } from "../../config";
import { InvalidToken, TokenNotProvided } from "../errors/validationError";
import { setContext } from "../helpers/context";
import { wrapAsyncMiddleware } from "../helpers/wrapper";

export const verifyToken = wrapAsyncMiddleware(
  async (
    req: Request & { user?: ITokenPayload },
    _res: Response,
    next: NextFunction
  ) => {
    const autheader = req.headers.authorization;
    const token = autheader && autheader.split(" ")[1];
    if (!token) {
      throw new TokenNotProvided();
    }

    jwt.verify(token, config.jwt.secretKey, (err: any, user: any) => {
      if (err) {
        throw new InvalidToken();
      }
      req.user = user as ITokenPayload;
      setContext(Global.AZURE_USER, req.user);
      next();
    });
  }
);
