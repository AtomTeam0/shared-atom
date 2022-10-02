import * as jayson from "jayson/promise";
import * as Joi from "joi";
import { RPCFunctionError } from "../errors/validationError";
import { defaultValidationOptions } from "../joi/joi.functions";
import { setPluginUsage } from "../schema/plugin.helpers";

export const RPCClientRequest = async (
  rpcClient: jayson.HttpClient,
  route: string,
  params?: { [k: string]: any }
): Promise<any> => {
  console.log(`-- ${route} RPC request was called --`);
  const isError = (obj: any) => !!obj.name && !!obj.message && !!obj.status;
  const { userId } = <any>global;

  const { result } = await rpcClient.request(route, {
    ...(userId && { userId }),
    params,
  });

  if (isError(result)) {
    throw result;
  }

  return result;
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
        return new RPCFunctionError(error);
      }
    }

    if (payload.userId) {
      (<any>global).userId = payload.userId;
    }

    // save temp globals
    const { skipCondition, skipPopulate, skipPatch } = <any>global;

    let result;
    try {
      result = await managerFunction(
        ...(payload.params ? Object.values(payload.params) : [])
      );
    } catch (error: any) {
      return new RPCFunctionError(error);
    } finally {
      // set globals back to original values
      setPluginUsage({ skipCondition, skipPopulate, skipPatch });
    }

    return result;
  };
