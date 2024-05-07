import { Function1 } from "lodash";
import {
  __,
  fill,
  filter,
  flow,
  fromPairs,
  get,
  includes,
  indexOf,
  isEqual,
  isFunction,
  isPlainObject,
  isString,
  isUndefined,
  join,
  keys,
  map,
  mapValues,
  nth,
  split,
  startsWith,
  update,
} from "lodash/fp";
import Paths from "./paths";
import {
  FinalResult,
  GetService,
  ParamRoute,
  Result,
  Service,
  TransformUrls,
  URLObject,
} from "./types";

//actually already exists in the nest utils, will be removed when shared is in the monorepo
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

  const prefix: `/${typeof Paths.api}/${T}` = `/${Paths.api}/${serviceName}`;

  return {
    prefix,
    routers,
  };
};

export const getPaths = <
  T extends Service,
  R extends undefined | keyof GetService<T> = undefined,
  P extends boolean = R extends undefined ? true : false,
>(
  serviceName: T,
  miniRouter?: R
): FinalResult<T, R, P> => {
  const service = Paths.services[serviceName];
  const result = (miniRouter ? service[miniRouter] : service) as Result<T, R>;
  const withParams = isUndefined(miniRouter);

  return (withParams ? transformUrls(result) : result) as FinalResult<T, R, P>;
};

//The code regarding transformUrls is a bit verbose and logic-heavy.
//basically, the function takes a Route object ({METHOD: ... URL: ...})
//and for parameterized routes ("/users/:id") it replaces the url with a function that,
//given the params, returns the full url. so, for example, for the object
//{METHOD: "get", URL: "/users/:param1/world/:param2"}, it would return something that
//looks like: {METHOD: "get", URL: (param1, param2) => `/users/${param1}/world/${param2}`}
//with some carefull reading, the code should be pretty understandable

const isParamRoute = (value: string): value is ParamRoute =>
  includes("/:", value);

const isURLObject = (obj: object): obj is URLObject =>
  "URL" in obj && isString(obj.URL) && isParamRoute(obj.URL);

const switchWithArg = (route: string, args: string[], segment: string) =>
  flow(
    split("/"),
    filter(startsWith(":")),
    indexOf(segment),
    nth(__, args)
  )(route)!;

const putArgIfParam = (route: string, args: string[]) => (segment: string) =>
  switchValueIf(startsWith(":"), switchWithArg(route, args, segment))(segment);

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
