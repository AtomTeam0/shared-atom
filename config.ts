export const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || "development",
  },
  azure: {
    azureAccountName: process.env.AZURE_ACCOUNT_NAME || "",
    azureAccountKey: process.env.AZURE_ACCOUNT_KEY || "",
    blobContainers: {
      imageContainerName: process.env.IMAGE_CONTAINER_NAME || "images",
      mp3ContainerName: process.env.MP3_CONTAINER_NAME || "mp3's",
      mp4ContainerName: process.env.MP4_CONTAINER_NAME || "mp4's",
    },
  },
  jwt: {
    secretKey: process.env.SECRET_KEY || "atomTeam",
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
