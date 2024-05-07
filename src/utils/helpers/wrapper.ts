import { NextFunction, Request, Response } from "express";

type AsyncRequestHandler<T = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void>;

type MiddlewareWrapper = (func: AsyncRequestHandler) => AsyncRequestHandler;
// standard wrappers (taken from the internet) that help with error handling & more
export const wrapValidator: MiddlewareWrapper =
  (func) => async (req, res, next) => {
    func(req, res, next)
      .then(() => next())
      .catch(next);
  };

export const wrapController =
  <T>(func: AsyncRequestHandler<T>): AsyncRequestHandler =>
  async (req, res, next) => {
    func(req as T, res, next).catch(next);
  };

export const wrapAsyncMiddleware: MiddlewareWrapper =
  (func) => async (req, res, next) => {
    func(req, res, next).catch(next);
  };
