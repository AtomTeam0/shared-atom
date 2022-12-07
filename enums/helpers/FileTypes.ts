import { config } from "../../config";
import { UnsupportedFileType } from "../../utils/errors/validationError";

export enum FileTypes {
  IMAGE = "img",
  MP3 = "mp3",
  MP4 = "mp4",
}

export const getContainerNameByFileType = (fileType: FileTypes) => {
  switch (fileType) {
    case FileTypes.IMAGE:
      return config.azure.blobContainers.imageContainerName;
    case FileTypes.MP3:
      return config.azure.blobContainers.mp3ContainerName;
    case FileTypes.MP4:
      return config.azure.blobContainers.mp4ContainerName;
    default:
      throw new UnsupportedFileType();
  }
};

export const getMimeTypeByFileType = (fileType: FileTypes) => {
  switch (fileType) {
    case FileTypes.IMAGE:
      return "image/png";
    case FileTypes.MP3:
      return "audio/mpeg";
    case FileTypes.MP4:
      return "video/mp4";
    default:
      throw new UnsupportedFileType();
  }
};
