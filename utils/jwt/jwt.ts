import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { IUser } from "../../interfaces/user.interface";
import { InvalidToken, TokenNotProvided } from "../errors/validationError";
import { JWTconfig } from "./jwt.config";

export const verifyToken = (req: Request & { user?: IUser }) => {
  const autheader = req.headers.authorization;
  const token = autheader && autheader.split(" ")[1];
  if (!token) {
    return new TokenNotProvided();
  }

  const res = jwt.verify(token, JWTconfig.secretKey, (err: any, user: any) => {
    if (err) {
      return new InvalidToken();
    }
    req.user = user as IUser;
    return undefined;
  });
  return res;
};
