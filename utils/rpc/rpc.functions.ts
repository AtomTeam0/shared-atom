import * as jayson from "jayson/promise";
import * as Joi from "joi";
import { RPCValidationError } from "../errors/generalError";
import { defaultValidationOptions } from "../joi/joi.functions";

const contextService = require("request-context");

export const RPCClientRequest = async (
  rpcHostname: string,
  rpcPort: number,
  route: string,
  params: { [k: string]: any } = {}
): Promise<any> => {
  const rpcClient = jayson.Client.http({
    hostname: rpcHostname,
    port: rpcPort,
  });

  console.log(`-- ${route} RPC request was called --`);

  const response = await rpcClient.request(route, [
    contextService.get("userId"),
    params,
  ]);
  return response.result;
};

export const RPCServerRequest =
  async (
    validator: Joi.ObjectSchema<any>,
    managerFunction: (val: any) => any
  ): Promise<any> =>
  async (args: Array<any>) => {
    const { error, value } = validator.validate(
      args[1],
      defaultValidationOptions
    );
    if (error) {
      throw new RPCValidationError();
    }

    contextService.set("userId", args[0]);
    const result = await managerFunction(value);
    return result;
  };
