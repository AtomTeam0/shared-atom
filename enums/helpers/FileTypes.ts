import { UnsupportedFileType } from "../../utils/errors/validationError";

export enum FileTypes {
  IMAGE = "img",
  MP3 = "mp3",
  MP4 = "mp4",
}

export const getContainerNameByFileType = (fileType: FileTypes) => {
  const IMAGE_CONTAINER_NAME = process.env.IMAGE_CONTAINER_NAME || "images";
  const MP3_CONTAINER_NAME = process.env.MP3_CONTAINER_NAME || "mp3's";
  const MP4_CONTAINER_NAME = process.env.MP4_CONTAINER_NAME || "mp4's";

  switch (fileType) {
    case FileTypes.IMAGE:
      return IMAGE_CONTAINER_NAME;
    case FileTypes.MP3:
      return MP3_CONTAINER_NAME;
    case FileTypes.MP4:
      return MP4_CONTAINER_NAME;
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
