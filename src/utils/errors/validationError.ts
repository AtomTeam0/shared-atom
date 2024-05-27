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

export class TokenNotProvided extends UserError {
  constructor() {
    super("Must provide token", 401);
  }
}
