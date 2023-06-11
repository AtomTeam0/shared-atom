import { v4 as uuidv4 } from "uuid";
import { FileTypes } from "common-atom/enums/helpers/FileTypes";
import { PDFDocumentProxy, getDocument } from "pdfjs-dist/legacy/build/pdf";
import {
  IFileDetails,
  IFileValidator,
} from "common-atom/interfaces/helpers/file.interface";
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

export const getBlobName = (
  file: IFileDetails,
  oldFileName?: string
): string => {
  const fileNameParts = file.originalFilename.split(".");
  if (oldFileName) {
    const oldFileNameParts = oldFileName.split(SEPERATOR);
    return oldFileName.replace(oldFileNameParts[0], fileNameParts[0]);
  }
  return `${fileNameParts[0]}${SEPERATOR}${file.mimetype.replace(
    "/",
    SLASH_REPLACER
  )}${SEPERATOR}${uuidv4()}.${fileNameParts[1]}`;
};

export const getMimetypeByBlobName = (blobName: string): string =>
  blobName.split(SEPERATOR)[1].replace(SLASH_REPLACER, "/");

export const getPdfPageCount = async (pdfFilePath: string): Promise<number> => {
  const doc: PDFDocumentProxy = await getDocument(pdfFilePath).promise;
  return doc._pdfInfo.numPages;
};
