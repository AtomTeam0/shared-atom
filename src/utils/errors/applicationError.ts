import { HttpStatusCode } from "axios";
import { flow } from "lodash/fp";

const generateError = (code: HttpStatusCode) => (message: string) => ({
  message,
  code,
});

const throwError = (code: HttpStatusCode) =>
  flow(generateError(code), (err) => {
    throw err;
  });

export const throwBadRequestError = throwError(HttpStatusCode.BadRequest);

export const generateUnauthorizedError = generateError(
  HttpStatusCode.Unauthorized
);
export const throwUnauthorizedError = throwError(HttpStatusCode.Unauthorized);

export const throwNotFoundError = (missingItem: string) => {
  throw generateError(HttpStatusCode.NotFound)(`${missingItem} not found`);
};

export const generateInternalServerError = generateError(
  HttpStatusCode.InternalServerError
);

export class ApplicationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super();

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || "Error: Undefined Application Error";
    this.status = status || 500;
  }
}

export class ServerError extends ApplicationError {
  constructor(message?: string, status?: number) {
    super(message || "Internal Server Error", status || 500);
  }
}

export class UserError extends ApplicationError {
  constructor(message?: string, status?: number) {
    super(message || "User Error", status || 400);
  }
}
