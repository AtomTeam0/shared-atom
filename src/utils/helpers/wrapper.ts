import { NextFunction, Response, Request as expressRequest } from "express";
import { Request } from "common-atom/interfaces/helpers/request.type";

// standard wrappers (taken from the internet) that help with error handling & more
export const wrapValidator =
  (func: (req: expressRequest) => Promise<void>) =>
  (req: expressRequest, _res: Response, next: NextFunction): void => {
    func(req)
      .then(() => next())
      .catch(next);
  };

export const wrapController =
  (func: (req: Request, res: Response, next?: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    func(req, res, next).catch(next);
  };

export const wrapAsyncMiddleware =
  (func: (req: expressRequest, res: Response, next: NextFunction) => Promise<void>) =>
  (req: expressRequest, res: Response, next: NextFunction): void => {
    func(req, res, next).catch(next);
  };
