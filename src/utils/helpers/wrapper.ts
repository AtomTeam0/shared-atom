import {NextFunction, Request, Response} from "express";

// standard wrappers (taken from the internet) that help with error handling & more
export const wrapValidator =
  (func: (req: Request) => Promise<void>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
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
  (func: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    func(req, res, next).catch(next);
  };
