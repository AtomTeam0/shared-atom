import { UserError } from "./applicationError";

export class AuthenticationError extends UserError {
  constructor(message?: string) {
    super(`Authentication Error -->  ${message}`, 401);
  }
}

export class PermissionError extends UserError {
  constructor(message?: string) {
    super(`Permission Error -->  ${message}`, 403);
  }
}
