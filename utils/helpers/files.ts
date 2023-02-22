import { FileTypes } from "../../common/enums/helpers/FileTypes";
import { IFileValidator } from "../../common/interfaces/helpers/file.interface";
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
