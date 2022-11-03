import * as jayson from "jayson/promise";
import * as Joi from "joi";
import { IRPCPayload } from "../../interfaces/helpers/rpcPayload.interface";
import { RPCFunctionError } from "../errors/validationError";
import { createContext } from "../helpers/context";
import { defaultValidationOptions } from "../joi/joi.functions";

export const RPCClientRequest = (
  skipPlugins = true
): ((
  rpcClient: jayson.HttpClient,
  route: string,
  params?:
    | {
        [k: string]: any;
      }
    | undefined
) => Promise<any>) => {
  const request = async (
    rpcClient: jayson.HttpClient,
    route: string,
    params?: { [k: string]: any }
  ): Promise<any> => {
    const isError = (obj: any) =>
      obj ? !!obj.name && !!obj.message && !!obj.status : false;
    const { userId, permission } = <any>global;

    console.log(`-- ${route} RPC request was called --`);
    const response = await rpcClient.request(route, {
      ...(userId && { userId }),
      ...(permission && { permission }),
      params,
      skipPlugins,
    });

    if (isError(response.result)) {
      throw response.result;
    }

    return response.result;
  };

  return request;
};

export const RPCServerRequest =
  (
    managerFunction: (...args: any) => Promise<any>,
    schemaValidation?: Joi.ObjectSchema<any>
  ): any =>
  async (payload: IRPCPayload) => {
    let result;
    try {
      if (schemaValidation) {
        await schemaValidation
          .unknown()
          .validateAsync(payload.params, defaultValidationOptions);
      }
      createContext({
        ...(payload.userId && { userId: payload.userId }),
        ...(payload.permission && { permission: payload.permission }),
        skipPlugins: payload.skipPlugins,
      });
      result = await managerFunction(
        ...(payload.params ? Object.values(payload.params) : [])
      );
    } catch (error: any) {
      return new RPCFunctionError(error);
    }

    return result;
  };
