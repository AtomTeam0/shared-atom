export const RPCconfig = {
  userService: {
    rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
    rpcHostname: process.env.USER_SERVICE_RPC_HOST || "localhost",
  },
  lessonService: {
    rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
    rpcHostname: process.env.LESSON_SERVICE_RPC_HOST || "localhost",
  },
  mediaService: {
    rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
    rpcHostname: process.env.MEDIA_SERVICE_RPC_HOST || "localhost",
  },
  itemService: {
    rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
    rpcHostname: process.env.ITEM_COMPOSITOR_RPC_HOST || "localhost",
  },
  newsService: {
    rpcPort: +(process.env.APPLICATION_RPC_PORT || 5000),
    rpcHostname: process.env.NEWS_COMPOSITOR_RPC_HOST || "localhost",
  },
};
