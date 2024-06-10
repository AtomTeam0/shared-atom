import { HttpStatusCode } from "axios";

export type httpError = {
  message: string;
  code: HttpStatusCode;
};

