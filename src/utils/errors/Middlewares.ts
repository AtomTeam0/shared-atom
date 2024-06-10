import { NextFunction, Request, Response } from "express";
import { Server } from "../../server";
import { httpError } from "./types";
import { generateInternalServerError } from "./ErrorGenerators";
import { isHttpError } from "./functions";

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

    log("error", message, JSON.stringify(req.user));

    res.status(code).send({ code, message });
    next();
  };
