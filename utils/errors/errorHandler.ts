import * as express from "express";
import { ServerError, UserError } from "./applicationError";

export const userErrorHandler =
  (log: (...args: any) => void) =>
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (error instanceof UserError) {
      log(
        "info",
        "User Error",
        `${error.name} was thrown with status ${error.status} and message ${error.message}`,
        "",
        JSON.stringify((req as any).user)
      );

      res.status(error.status).send({
        type: error.name,
        message: error.message,
      });

      next();
    } else {
      next(error);
    }
  };

export const serverErrorHandler =
  (log: (...args: any) => void) =>
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (error instanceof ServerError) {
      log(
        "warn",
        "Server Error",
        `${error.name} was thrown with status ${error.status} and message ${error.message}`,
        "",
        JSON.stringify((req as any).user)
      );
      res.status(error.status).send({
        type: error.name,
        message: error.message,
      });

      next();
    } else {
      next(error);
    }
  };

export const unknownErrorHandler =
  (log: (...args: any) => void) =>
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    log(
      "error",
      "Unknown Error",
      `${error.name} was thrown with status 500 and message ${error.message}`,
      "",
      JSON.stringify((req as any).user)
    );
    res.status(500).send({
      type: error.name,
      message: error.message,
    });

    next(error);
  };
