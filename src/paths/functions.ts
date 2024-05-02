import { Function1, isObject } from "lodash";
import {
  __,
  capitalize,
  fill,
  flow,
  fromPairs,
  get,
  includes,
  indexOf,
  isEqual,
  isFunction,
  isString,
  join,
  keys,
  map,
  mapValues,
  nth,
  split,
  startsWith,
  update,
} from "lodash/fp";
import paths from "./paths";
import {
  FinalResult,
  GetService,
  ParamRoute,
  Params,
  ParamsReplacer,
  ReplaceParams,
  Result,
  Service,
  TransformUrls,
  URLObject,
} from "./types";

const switchValueIf =
  <Origin, Result>(
    condition: Origin | Function1<Origin, boolean>,
    result: Result | Function1<Origin, Result>
  ) =>
  (value: Origin) => {
    const doesMatchCondition = isFunction(condition)
      ? condition(value)
      : isEqual(value, condition);
    const finalResult = isFunction(result) ? result(value) : result;

    return doesMatchCondition ? finalResult : value;
  };

export const getRouters = <T extends Service>(serviceName: T) => {
  const routers = flow(
    get(serviceName),
    keys,
    map(fill(0, 2, __, Array(2))),
    fromPairs
  )(paths.services) as {
    [key in keyof GetService<T>]: key;
  };

  return {
    prefix: `/${paths.api}/${serviceName}`,
    routers,
  };
};

const isParamRoute = (value: string): value is ParamRoute =>
  includes("/:", value) || startsWith(":", value);

const isURLObject = (obj: object): obj is URLObject =>
  "URL" in obj && isString(obj.URL) && isParamRoute(obj.URL);

const switchWithArg = (route: string, args: string[]) => (segment: string) =>
  flow(split("/"), indexOf(segment), nth(__, args))(route)!;

const putArgIfParam = (route: string, args: string[]) => (segment: string) =>
  switchValueIf(startsWith(":"), switchWithArg(route, args))(segment);

const toURLFunction =
  <Route extends string>(route: Route): ParamsReplacer<Route> =>
  <Args extends Params<Route>>(...args: Args) =>
    flow(
      split("/"),
      map(putArgIfParam(route, args)),
      join("/")
    )(route) as ReplaceParams<Route, Args>;

const transformUrls = <Paths extends object>(
  paths: Paths
): TransformUrls<Paths> =>
  mapValues(
    switchValueIf(isObject, updateNestedUrls),
    paths
  ) as TransformUrls<Paths>;

const updateNestedUrls = flow(
  switchValueIf(isURLObject, update("URL", toURLFunction)),
  transformUrls
);

export const getPaths = <
  T extends Service,
  R extends undefined | keyof GetService<T> = undefined,
  P extends boolean = false,
>(
  serviceName: T,
  miniRouter?: R,
  withParams?: P
): FinalResult<T, R, P> => {
  const service = paths.services[serviceName];
  const result = (miniRouter ? service[miniRouter] : service) as Result<T, R>;

  return (withParams ? transformUrls(result) : result) as FinalResult<T, R, P>;
};
