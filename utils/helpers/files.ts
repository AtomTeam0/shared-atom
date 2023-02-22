import { v4 as uuidv4 } from "uuid";
import { FileTypes } from "../../common/enums/helpers/FileTypes";
import {
  IFileDetails,
  IFileValidator,
} from "../../common/interfaces/helpers/file.interface";
import { config } from "../../config";

export const getContainerNameByFileType = (fileType: FileTypes): string => {
  switch (fileType) {
    case FileTypes.IMAGE:
      return "image-container";
    case FileTypes.AUDIO:
      return "audio-container";
    case FileTypes.VIDEO:
      return "video-container";
    case FileTypes.PDF:
      return "pdf-container";
    default:
      return "other-container";
  }
};

export const getValidatorByFileType = (fileType: FileTypes): IFileValidator =>
  config.formidable.fileValidators[fileType] as IFileValidator;

const SEPERATOR = "__";
const SLASH_REPLACER = "-";

export const getBlobName = (file: IFileDetails): string => {
  const fileNameParts = file.originalFilename.split(".");
  return `${fileNameParts[0]}${SEPERATOR}${file.mimetype.replace(
    "/",
    SLASH_REPLACER
  )}${SEPERATOR}${uuidv4()}.${fileNameParts[1]}`;
};

export const getMimetypeByBlobName = (blobName: string): string =>
  blobName.split(SEPERATOR)[1].replace(SLASH_REPLACER, "/");
