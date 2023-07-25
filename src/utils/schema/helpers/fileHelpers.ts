import { IFileDetails } from "common-atom/interfaces/helpers/file.interface";
import { promises as fsPromises } from "fs";
import { config } from "../../../config";
import { FileConvertionError, FileUploadError } from "../../errors/filesError";
import axios, { AxiosError } from "axios";

export const getFileUrl = async (fileId: string) =>
  `${config.fileService.download.hostname}/${config.fileService.download.innerDirectory}/${config.fileService.fileNameStarter}_${fileId}`;

export const uploadFile = async (file: IFileDetails) => {
  let fileBase64;
  const FileType = file.originalFilename.split(".")[1];

  try {
    const data = await fsPromises.readFile(file.filepath);
    fileBase64 = data.toString("base64");
  } catch (error) {
    throw new FileConvertionError();
  }

  try {
    const response = await axios.post(
      `${config.fileService.upload.hostname}/${config.fileService.upload.route}`,
      {
        filebase64: fileBase64,
        projectId: config.fileService.projectId,
        FileProperties: {
          FileName: `${config.fileService.fileNameStarter}_${file.originalFilename}`,
          FileType,
        },
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Archive-Api-Key": config.fileService.archiveApiKey,
        },
      }
    );
    // response data from the Archive looks like this :  response data  { FileId: 'fe499ec1-8d15-4974-aa76-44ba69e3452a' }
    // we only need the id.
    return response.data.FileId;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (axiosError && axiosError.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      throw new FileUploadError(axiosError.message, axiosError.response.status);
    } else if (axiosError && axiosError.request) {
      // The request was made but no response was received
      throw new FileUploadError(
        "No response received from upload service (Archive)",
        502
      ); // 502 Bad Gateway might be appropriate here
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new FileUploadError(
        axiosError ? axiosError.message : "Unknown upload error",
        500
      );
    }
  }
};
