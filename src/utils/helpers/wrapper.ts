import { NextFunction, Response, Request as expressRequest } from "express";

// standard wrappers (taken from the internet) that help with error handling & more
export const wrapValidator =
  (func: (req: expressRequest) => Promise<void>) =>
  (req: expressRequest, _res: Response, next: NextFunction): void => {
    func(req)
      .then(() => next())
      .catch(next);
  };

export const wrapController =
  <P, B, Q>(
    func: (
      req: expressRequest<P, object, B, Q>,
      res: Response,
      next?: NextFunction
    ) => Promise<void>
  ) =>
  (
    req: expressRequest<P, object, B, Q>,
    res: Response,
    next: NextFunction
  ): void => {
    func(req, res, next).catch(next);
  };

export const wrapAsyncMiddleware =
  (
    func: (
      req: expressRequest,
      res: Response,
      next: NextFunction
    ) => Promise<void>
  ) =>
  (req: expressRequest, res: Response, next: NextFunction): void => {
    func(req, res, next).catch(next);
  };
