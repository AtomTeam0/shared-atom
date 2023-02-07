import { UserError } from "./applicationError";

export class UnsupportedFileType extends UserError {
  constructor(fileType = "unknown type") {
    super(`Invalid file type: ${fileType}`, 403);
  }
}

export class UnsupportedFileSize extends UserError {
  constructor(fileSize = 0) {
    super(`Invalid file size: ${fileSize} bytes`, 403);
  }
}
