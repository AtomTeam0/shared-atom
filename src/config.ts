export const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || "development",
    withDeepPlugin: (process.env.WITH_DEEP_PULGINS || "true") === "true",
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
      rpcHostname: process.env.NEWS_SERVICE_RPC_HOST || "localhost",
    },
  },
  fileService: {
    projectId: +(process.env.PROJECT_ID || 1),
    fileNameStarter: process.env.FILE_NAME_STARTER || "mynet",
    archiveApiKey: process.env.ARCHIVE_API_KEY || "",
    upload: {
      hostname:
        process.env.UPLOAD_FILE_SERVICE_HOSTNAME ||
        "https://api.digital.idf.il/external/hatch",
      route: process.env.UPLOAD_FILE_SERVICE_ROUTE || "func-upload",
    },
    download: {
      hostname:
        process.env.DOWNLOAD_FILE_SERVICE_HOSTNAME ||
        "https://mynet.dev.digital.idf.il",
      innerDirectory:
        process.env.DOWNLOAD_FILE_SERVICE_INNER_DIRECTORY || "assets",
    },
  },
  formidable: {
    propertyConfigs: {
      item: ["thumbNail"],
      unit: ["image"],
      infographic: ["image"],
      area: ["image"],
      article: ["thunbNail", "bestSoldier.image", "pdf"],
      lesson: ["pdf"],
      pakal: ["pdf"],
      media: ["video", "audio"],
      playlist: ["thunbNail", "pdf"],
      book: ["thunbNail"],
    },
  },
};
console.log(config);
