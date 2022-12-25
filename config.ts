export const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || "development",
  },
  azure: {
    azureAccountName: process.env.AZURE_ACCOUNT_NAME || "",
    azureAccountKey: process.env.AZURE_ACCOUNT_KEY || "",
  },
  jwt: {
    secretKey: process.env.SECRET_KEY || "atomTeam",
  },
  multer: {
    maxSize: +(process.env.MAX_FILE_SIZE || 2 * 1024 * 1024), // 2MB by default
    encoding: process.env.FILE_ENCODING || "binary",
    fileTypes: process.env.FILE_TYPES || [
      "video/mp4",
      "audio/mp3",
      "image/jpeg",
      "image/png",
    ],
  },
  rpc: {
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
  },
};
