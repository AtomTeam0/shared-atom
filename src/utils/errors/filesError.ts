import { UserError } from "./applicationError";

export class FileConvertionError extends UserError {
  constructor() {
    super(`File could not be converted to base64`, 403);
  }
}
