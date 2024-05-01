import * as paths from "./paths.json";

type Method = "get" | "post" | "delete" | "patch" | "put";

type SwitchMethod<T extends object, key extends keyof T> = key extends "METHOD"
  ? T[key] extends string
    ? Method
    : T[key]
  : T[key];

type service = keyof typeof paths.services;

type GetService<T extends service> = (typeof paths.services)[T];

//recursively switches every "METHODS" field in T to a valid method string
export type ConvertMethod<T extends object> = {
  [key in keyof T]: T[key] extends object
    ? ConvertMethod<T[key]>
    : SwitchMethod<T, key>;
};

export type Result<
  T extends service,
  R extends undefined | keyof GetService<T>,
> = NonNullable<
  R extends undefined ? GetService<T> : GetService<T>[NonNullable<R>]
>;
