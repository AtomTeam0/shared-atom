import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { includes, isObject, isString, values } from "lodash/fp";
import { Server } from "../../server";
import { generateInternalServerError } from "./applicationError";

//permission, idnotfound, user

export type httpError = {
  message: string;
  code: HttpStatusCode;
};

const isHttpError = (possibleError: unknown): possibleError is httpError =>
  isObject(possibleError) &&
  "message" in possibleError &&
  "code" in possibleError &&
  isString(possibleError.message) &&
  includes(possibleError.code, values(HttpStatusCode));

export const errorCatcherMiddleware =
  (log: Server["log"]) =>
  (
    error: httpError | string,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { code, message } = isHttpError(error)
      ? error
      : generateInternalServerError(error);

    res.status(code).send({ code, message });
  };
