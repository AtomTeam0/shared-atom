import { FileTypes } from "./common/enums/helpers/FileTypes";

export const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || "development",
    withDeepPlugin: (process.env.WITH_DEEP_PULGINS || "true") === "true",
  },
  azure: {
    azureAccountName: process.env.AZURE_ACCOUNT_NAME || "mynetappstorage",
    azureAccountKey:
      process.env.AZURE_ACCOUNT_KEY ||
      "Jh/Zzyow6JnYs9N5yJZ2f3FTCErIn9/QffR5nRpnfIjVmv+l5FLbDhB7V/0FPh2BH9jy3eHl0ad3+AStI4wcXQ==",
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
  formidable: {
    propertyConfigs: {
      item: [
        {
          property: "thumbNail",
          fileType: FileTypes.IMAGE,
        },
      ],
      unit: [
        {
          property: "image",
          fileType: FileTypes.IMAGE,
        },
      ],
      infographic: [
        {
          property: "image",
          fileType: FileTypes.IMAGE,
        },
      ],
      area: [
        {
          property: "image",
          fileType: FileTypes.IMAGE,
        },
      ],
      article: [
        {
          property: "thunbNail",
          fileType: FileTypes.IMAGE,
        },
        {
          property: "bestSoldier.image",
          fileType: FileTypes.IMAGE,
        },
        {
          property: "pdf",
          fileType: FileTypes.PDF,
        },
      ],
      lesson: [
        {
          property: "pdf",
          fileType: FileTypes.PDF,
        },
      ],
      pakal: [
        {
          property: "pdf",
          fileType: FileTypes.PDF,
        },
      ],
      media: [
        {
          property: "video",
          fileType: FileTypes.VIDEO,
        },
        {
          property: "audio",
          fileType: FileTypes.AUDIO,
        },
      ],
    },
  },
};
