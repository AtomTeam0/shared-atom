import * as jayson from 'jayson/promise';

export const RPCRequest = async (rpcHostname: string, rpcPort: number, route: string, params: {[k: string]: any} = {}): Promise<any> => {
  const rpcClient = jayson.Client.http({
    hostname: rpcHostname,
    port: rpcPort,
  });

  console.log(`-- ${route} RPC request was called --`);
  
  const response = await rpcClient.request(route, params);
  return response.result;
};
