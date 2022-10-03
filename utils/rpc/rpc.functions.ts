import * as jayson from "jayson/promise";
import * as Joi from "joi";
import { IRPCPayload } from "../../interfaces/helpers/rpcPayload.interface";
import { RPCFunctionError } from "../errors/validationError";
import { defaultValidationOptions } from "../joi/joi.functions";
import { initPluginUsage } from "../schema/plugin.helpers";

export const RPCClientRequest = async (
  rpcClient: jayson.HttpClient,
  route: string,
  params?: { [k: string]: any }
): Promise<any> => {
  console.log(`-- ${route} RPC request was called --`);
  const isError = (obj: any) => !!obj.name && !!obj.message && !!obj.status;
  const { userId, permission } = <any>global;

  const response = await rpcClient.request(route, {
    ...(userId && { userId }),
    ...(permission && { permission }),
    params,
  });

  if (isError(response)) {
    throw response.result;
  }

  return response.result;
};

export const RPCServerRequest =
  (
    managerFunction: (val?: any) => Promise<any>,
    validator?: Joi.ObjectSchema<any>
  ): any =>
  async (payload: IRPCPayload) => {
    if (validator) {
      const { error } = validator.validate(
        payload.params,
        defaultValidationOptions
      );
      if (error) {
        return new RPCFunctionError(error);
      }
    }
    initPluginUsage(payload.userId, payload.permission);

    let result;
    try {
      result = await managerFunction(
        ...(payload.params ? Object.values(payload.params) : [])
      );
    } catch (error: any) {
      return new RPCFunctionError(error);
    }

    return result;
  };
