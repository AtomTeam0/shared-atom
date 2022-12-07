import * as jayson from "jayson/promise";
import * as Joi from "joi";
import { Global } from "../../common/enums/helpers/Global";
import { IRPCPayload } from "../../common/interfaces/helpers/rpcPayload.interface";
import { RPCFunctionError } from "../errors/validationError";
import { getContext, runWithContext, setContext } from "../helpers/context";
import { defaultValidationOptions } from "../joi/joi.functions";

export const RPCClientRequest = async (
  rpcClient: jayson.HttpClient,
  route: string,
  params?:
    | {
        [k: string]: any;
      }
    | undefined,
  skipPlugins = true
): Promise<any> => {
  const isError = (obj: any) =>
    obj ? !!obj.name && !!obj.message && !!obj.status : false;
  const user = getContext(Global.USER);

  console.log(`-- ${route} RPC request was called --`);
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

export const RPCServerRequest =
  (
    managerFunction: (...args: any) => Promise<any>,
    schemaValidation?: Joi.ObjectSchema<any>
  ): any =>
  async (payload: IRPCPayload) =>
    runWithContext(async () => {
      let result;
      try {
        if (schemaValidation) {
          await schemaValidation
            .unknown()
            .validateAsync(payload.params, defaultValidationOptions);
        }

        setContext(Global.USER, payload.user);
        setContext(Global.SKIP_PLUGINS, payload.skipPlugins);

        result = await managerFunction(
          ...(payload.params ? Object.values(payload.params) : [])
        );
      } catch (error: any) {
        return new RPCFunctionError(error);
      }

      return result;
    });
