import * as jayson from "jayson/promise";
import * as Joi from "joi";
import { RPCValidationError } from "../errors/validationError";
import { defaultValidationOptions } from "../joi/joi.functions";
import { setPluginUsage } from "../schema/plugin.helpers";

export const RPCClientRequest = async (
  rpcClient: jayson.HttpClient,
  route: string,
  params?: { [k: string]: any }
): Promise<any> => {
  console.log(`-- ${route} RPC request was called --`);

  const { userId } = <any>global;

  const response = await rpcClient.request(route, {
    ...(userId && { userId }),
    params,
  });
  return response.result;
};

export const RPCServerRequest =
  (
    managerFunction: (val?: any) => Promise<any>,
    validator?: Joi.ObjectSchema<any>
  ): any =>
  async (payload: { userId?: string; params?: { [k: string]: any } }) => {
    if (validator) {
      const { error } = validator.validate(
        payload.params,
        defaultValidationOptions
      );
      if (error) {
        throw new RPCValidationError();
      }
    }

    if (payload.userId) {
      (<any>global).userId = payload.userId;
    }

    setPluginUsage(true, true, true);
    const result = await managerFunction(
      ...(payload.params ? Object.values(payload.params) : [])
    );
    setPluginUsage(false, false, false);

    return result;
  };
