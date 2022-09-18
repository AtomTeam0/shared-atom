import * as jayson from "jayson/promise";
import * as Joi from "joi";
import { RPCValidationError } from "../errors/validationError";
import { defaultValidationOptions } from "../joi/joi.functions";

const contextService = require("request-context");

export const RPCClientRequest = async (
  rpcClient: jayson.HttpClient,
  route: string,
  params?: { [k: string]: any }
): Promise<any> => {
  console.log(`-- ${route} RPC request was called --`);

  const userId = contextService.get("userId");

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
      contextService.set("userId", payload.userId);
    }

    const result = payload.params
      ? await managerFunction(...Object.values(payload.params))
      : await managerFunction();
    return result;
  };
