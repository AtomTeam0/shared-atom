import { ServerError, UserError } from "./applicationError";

export class RPCFunctionError extends ServerError {
  constructor(err?: Error) {
    super(`RPC function error${err && `: ${err.message}`}`, 400);
  }
}
export class IdNotFoundError extends UserError {
  constructor(funcName: string) {
    super(`id given in ${funcName} is not found in the db`, 404);
  }
}

export class IdArrayNotFoundError extends UserError {
  constructor(funcName: string) {
    super(`one or more id's given in ${funcName} is not found in the db`, 404);
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
