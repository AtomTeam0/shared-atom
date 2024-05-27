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

export const generateBadRequestError = generateError(HttpStatusCode.BadRequest);
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
