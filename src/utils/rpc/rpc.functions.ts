import { Global } from "common-atom/enums/helpers/Global";
import { Plugins } from "common-atom/enums/Plugins";
import { HttpClient } from "jayson/promise";
import { getContext } from "../helpers/context";

// a generic RPC function for the sending side
export const RPCClientRequest = async (
  rpcClient: HttpClient,
  route: string,
  params?:
    | {
        [k: string]: any;
      }
    | undefined,
  skipPlugins?: Plugins[]
): Promise<any> => {
  const isError = (obj: any) =>
    obj ? !!obj.name && !!obj.message && !!obj.status : false;
  const user = getContext(Global.USER);

  console.log(`-- ${route} RPC request was called -- with params => `, params);
  const response = await rpcClient.request(route, {
    ...(user && { user }),
    skipPlugins,
    params,
  });

  if (isError(response.result)) {
    throw response.result;
  }

  return response.result;
};