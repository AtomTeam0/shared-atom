import { UserError } from "./applicationError";

export class UnsupportedFile extends UserError {
  constructor(fileProperty = "unknown property") {
    super(
      `Invalid file property: ${fileProperty} is not allowed as a file in this route`,
      403
    );
  }
}

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
