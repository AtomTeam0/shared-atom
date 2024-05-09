export const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || "development",
    withDeepPlugin: (process.env.WITH_DEEP_PULGINS || "true") === "true",
  },
  jwt: {
    secretKey: process.env.SECRET_KEY || "atomTeam",
  },
  rpc: {
    itemService: {
      rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
      rpcHostname: process.env.ITEM_COMPOSITOR_RPC_HOST || "localhost",
    },
    userService: {
      rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
      rpcHostname: process.env.USER_SERVICE_RPC_HOST || "localhost",
    },
  },
};
