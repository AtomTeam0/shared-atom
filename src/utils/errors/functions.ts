import { includes, isObject, isString, values } from "lodash/fp";
import { httpError } from "./types";
import { HttpStatusCode } from "axios";

export const isHttpError = (
  possibleError: unknown
): possibleError is httpError =>
  isObject(possibleError) &&
  "message" in possibleError &&
  "code" in possibleError &&
  isString(possibleError.message) &&
  includes(possibleError.code, values(HttpStatusCode));
