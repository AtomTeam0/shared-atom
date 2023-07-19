import { UserError } from "./applicationError";

export class FileConvertionError extends UserError {
  constructor() {
    super(`File could not be converted to base64`, 403);
  }
}

export class FileUploadError extends UserError {
  constructor(message?: string, status?: number) {
    super(`File upload failed with message ${message}`, 403);
  }
}
