import { FileTypes } from "common-atom/enums/helpers/FileTypes";

const MB = 1024 * 1024;

export const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || "development",
    withDeepPlugin: (process.env.WITH_DEEP_PULGINS || "true") === "true",
  },
  aws: {
    region: process.env.AWS_S3_REGION || "us-east-1",
    defaultRegion: "us-east-1",
    accessKeyId: process.env.AWS_S3_ACCESS_KEYID || "aws-access-key",
    secretAccessKey:
      process.env.AWS_S3_SECRET_ACCESSKEY || "supre-duper-secret-key",
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathS3: (process.env.AWS_S3_FORCE_PATH || "true") === "true",
    isBucketPoint: (process.env.AWS_S3_IS_BUCKET_POINT || "true") === "true",
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
  formidable: {
    fileValidators: {
      [FileTypes.IMAGE]: {
        maxFileSize: +(process.env.IMAGE_MAX_FILE_SIZE || 2) * MB,
        allowedMimeTypes: process.env.IMAGE_ALLOWED_MIME_TYPES || [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/svg+xml",
        ],
      },
      [FileTypes.AUDIO]: {
        maxFileSize: +(process.env.AUDIO_MAX_FILE_SIZE || 10) * MB,
        allowedMimeTypes: process.env.AUDIO_ALLOWED_MIME_TYPES || [
          "audio/mpeg",
          "audio/x-wav",
        ],
      },
      [FileTypes.VIDEO]: {
        maxFileSize: +(process.env.VIDEO_MAX_FILE_SIZE || 20) * MB,
        allowedMimeTypes: process.env.VIDEO_ALLOWED_MIME_TYPES || [
          "video/mp4",
          "video/x-msvideo",
          "video/x-ms-wmv",
          "image/gif",
        ],
      },
      [FileTypes.PDF]: {
        maxFileSize: +(process.env.PDF_MAX_FILE_SIZE || 15) * MB,
        allowedMimeTypes: process.env.PDF_ALLOWED_MIME_TYPES || [
          "application/pdf",
        ],
      },
    },
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
      book: [
        {
          property: "thumbNail",
          fileType: FileTypes.IMAGE,
        },
        {
          property: "pdf",
          fileType: FileTypes.PDF,
        },
      ],
      subject: [
        {
          property: "book",
          fileType: FileTypes.PDF,
        },
      ],
      playlist: [
        {
          property: "thumbNail",
          fileType: FileTypes.IMAGE,
        },
      ],
    },
  },
};
