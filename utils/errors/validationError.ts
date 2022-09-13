import { ServerError, UserError } from "./applicationError";

export class RPCValidationError extends ServerError {
  constructor() {
    super("RPC validation error", 400);
  }
}

export class IdNotFoundError extends UserError {
  constructor(propertyName: string) {
    super(`${propertyName} id is not found in the db`, 404);
  }
}

export class IdArrayNotFoundError extends UserError {
  constructor(propertyName: string) {
    super(
      `one or more id's from ${propertyName} property were not found in the db`,
      404
    );
  }
}
