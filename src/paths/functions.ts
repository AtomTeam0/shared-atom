import { __, fill, flow, fromPairs, get, keys, map } from "lodash/fp";
import * as paths from "./paths.json";
import { Paths } from "./types";

export const getRouters = <T extends keyof typeof paths.services>(
  serviceName: T
) => {
  const routers = flow(
    get(serviceName),
    keys,
    map(fill(0, 2, __, Array(2))),
    fromPairs
  )(paths.services) as {
    [key in keyof (typeof paths.services)[T]]: key;
  };

  return {
    prefix: `/${paths.api}/${serviceName}`,
    routers,
  };
};

export const getPaths = <
  T extends keyof typeof paths.services,
  R extends undefined | keyof (typeof paths.services)[T] = undefined,
>(
  serviceName: T,
  miniRouter?: R
): Paths<
  NonNullable<
    R extends undefined
      ? (typeof paths.services)[T]
      : (typeof paths.services)[T][NonNullable<R>]
  >
> => {
  const service = paths.services[serviceName];
  const result = (miniRouter ? service[miniRouter] : service) as ReturnType<
    typeof getPaths<T, R>
  >;

  return result;
};
