import paths from "./paths";

export type Service = keyof typeof paths.services;

export type GetService<T extends Service> = (typeof paths.services)[T];

export type Result<
  T extends Service,
  R extends undefined | keyof GetService<T>,
> = NonNullable<
  R extends undefined ? GetService<T> : GetService<T>[NonNullable<R>]
>;

type LastUrlPart<T extends string> = T extends `${string}/${infer Res}`
  ? `/${Res}`
  : "";

export type ReplaceParams<
  Route extends string,
  Arr extends Params<Route>,
> = Route extends `${infer Prefix}/:${infer Suffix}`
  ? Arr extends [
      infer Current extends string,
      ...infer Rest extends Params<LastUrlPart<Suffix>>,
    ]
    ? `${Prefix}/${Current}${ReplaceParams<LastUrlPart<Suffix>, Rest>}`
    : Route
  : Route;

export type Params<
  Route extends string,
  Result extends string[] = [],
> = Route extends `${string}/:${infer Suffix}`
  ? Params<Suffix, [string, ...Result]>
  : Result;

export type ParamsReplacer<Route extends string> = <Args extends Params<Route>>(
  ...args: Args
) => ReplaceParams<Route, Args>;

export type ParamRoute = `${string}/:${string}`;

type SwitchURL<T extends { URL: string }> = Omit<T, "URL"> & {
  URL: ParamsReplacer<T["URL"]>;
};

export type URLObject = {
  URL: ParamRoute;
} & Record<string, unknown>;

type HandleObject<T extends object> = T extends URLObject ? SwitchURL<T> : T;

//in every "URL" nested field, checks if it is a parametarized route (contains ":"), and if so, switches the URL with a function that receives the params and returns the url
export type TransformUrls<T extends object> = {
  [key in keyof T]: T[key] extends Record<string, unknown>
    ? TransformUrls<HandleObject<T[key]>>
    : T[key];
};

export type FinalResult<
  T extends Service,
  R extends undefined | keyof GetService<T>,
  withParams extends boolean,
> = withParams extends true ? TransformUrls<Result<T, R>> : Result<T, R>;
