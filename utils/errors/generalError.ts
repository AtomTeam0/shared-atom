import { UserError } from "./applicationError";

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
