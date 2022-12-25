import { ServerError, UserError } from "./applicationError";

export class RPCFunctionError extends ServerError {
  constructor(err?: Error) {
    super(`RPC function error${err && `: ${err.message}`}`, 400);
  }
}
export class InvalidMongoIdError extends UserError {
  constructor(propertyName?: string) {
    super(
      `Id given is not a valid mongo id${
        propertyName ? ` (${propertyName})` : ""
      }`,
      403
    );
  }
}

export class IdNotFoundError extends UserError {
  constructor(propertyName?: string) {
    super(
      `Id given is not found in the db${
        propertyName ? ` (${propertyName})` : ""
      }`,
      404
    );
  }
}

export class IdArrayNotFoundError extends UserError {
  constructor(propertyName?: string) {
    super(
      `One or more id's given are not found in the db${
        propertyName ? ` (${propertyName})` : ""
      }`,
      404
    );
  }
}

export class TokenNotProvided extends UserError {
  constructor() {
    super("Must provide token", 401);
  }
}

export class InvalidToken extends UserError {
  constructor() {
    super("Invalid Token", 401);
  }
}

export class InvalidAnswersTestByUser extends ServerError {
  constructor() {
    super("Invalid answers array length", 403);
  }
}

export class UnsupportedFileType extends UserError {
  constructor(fileType: string) {
    super(`Invalid file type: ${fileType}`, 403);
  }
}

export class InvalidCoordinateError extends UserError {
  constructor() {
    super(
      "Coordinate must be formated this way: [coordinateX, coordinateY] as two numbers",
      403
    );
  }
}

export class InvalidWeekNumError extends UserError {
  constructor() {
    super("weekNum must be in range 1-52", 403);
  }
}

export class PoligonIntersectionError extends UserError {
  constructor() {
    super("New polygon cannot intesect with existing area`s polygon", 403);
  }
}
