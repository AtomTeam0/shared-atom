import { NextFunction, Request, Response } from "express";
import { Server } from "../../server";
import { httpError, isHttpError } from "./types";
import { generateInternalServerError } from "./ErrorGenerators";

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
