export const RPCconfig = {
  userService: {
    rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
    rpcHostname: process.env.USERS_API_RPC_HOST || "localhost",
  },
  lessonService: {
    rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
    rpcHostname: process.env.USERS_API_RPC_HOST || "localhost",
  },
  mediaService: {
    rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
    rpcHostname: process.env.USERS_API_RPC_HOST || "localhost",
  },
  itemService: {
    rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
    rpcHostname: process.env.USERS_API_RPC_HOST || "localhost",
  },
};
