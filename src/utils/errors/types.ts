import { HttpStatusCode } from "axios";
import { includes, isObject, isString, values } from "lodash/fp";

export type httpError = {
  message: string;
  code: HttpStatusCode;
};

export const isHttpError = (possibleError: unknown): possibleError is httpError =>
  isObject(possibleError) &&
  "message" in possibleError &&
  "code" in possibleError &&
  isString(possibleError.message) &&
  includes(possibleError.code, values(HttpStatusCode));
