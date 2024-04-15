//recursively switches every "METHODS" field in T to a valid method string
export type Paths<T extends object> = {
  [key in keyof T]: T[key] extends object
    ? Paths<T[key]>
    : key extends "METHOD"
      ? T[key] extends string
        ? "get" | "create" | "delete" | "patch" | "put"
        : T[key]
      : T[key];
};
