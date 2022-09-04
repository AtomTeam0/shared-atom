import { ServerError, UserError } from "./applicationError";

export class ValidationError extends ServerError {
  constructor() {
    super("validation error", 400);
  }
}

export class RPCValidationError extends ServerError {
  constructor() {
    super("RPC validation error", 400);
  }
}

export class AuthenticationError extends UserError {
  constructor(message?: string) {
    super(message || "Authentication Error", 401);
  }
}

export class PermissionError extends UserError {
  constructor(message?: string) {
    super(message || "Permission Error", 403);
  }
}
