import { __, fill, flow, fromPairs, get, keys, map } from "lodash/fp";
import * as paths from "./paths.json";

export const getRoutes = <T extends keyof typeof paths.services>(
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
