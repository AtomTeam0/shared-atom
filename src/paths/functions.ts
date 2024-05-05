import { Function1 } from "lodash";
import {
  __,
  fill,
  flow,
  fromPairs,
  get,
  includes,
  indexOf,
  isEqual,
  isFunction,
  isPlainObject,
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
import {
  FinalResult,
  GetService,
  ParamRoute,
  Result,
  Service,
  TransformUrls,
  URLObject,
} from "./types";
import Paths from "./paths";

const switchValueIf =
  <Origin, Result>(
    condition: Origin | Function1<Origin, boolean>,
    result: Result | Function1<Origin, Result>
  ) =>
  (value: Origin) => {
    const doesMatchCondition = isFunction(condition)
      ? condition(value)
      : isEqual(value, condition);

    if (!doesMatchCondition) return value;

    const finalResult = isFunction(result) ? result(value) : result;

    return finalResult;
  };

export const getRouters = <T extends Service>(serviceName: T) => {
  const routers = flow(
    get(serviceName),
    keys,
    map(fill(0, 2, __, Array(2))),
    fromPairs
  )(Paths.services) as {
    [key in keyof GetService<T>]: key;
  };

  return {
    prefix: `/${Paths.api}/${serviceName}`,
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
  (route: string) =>
  (...args: string[]) =>
    flow(split("/"), map(putArgIfParam(route, args)), join("/"))(route);

const transformUrls = <Paths extends object>(
  paths: Paths
): TransformUrls<Paths> =>
  mapValues(
    switchValueIf(isPlainObject, updateNestedUrls),
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
  const service = Paths.services[serviceName];
  const result = (miniRouter ? service[miniRouter] : service) as Result<T, R>;

  return (withParams ? transformUrls(result) : result) as FinalResult<T, R, P>;
};
