import {IFileDetails} from "common-atom/interfaces/helpers/file.interface";
import {promises as fsPromises} from "fs";
import axios, {AxiosError} from "axios";
import {config} from "../../../config";
import {FileConvertionError, FileDownloadError, FileUploadError,} from "../../errors/filesError";

export const getFileUrl = async (fileId: string) => {
  console.log(
    "get File called",
    `${config.fileService.hostname}/${config.fileService.downloadRoute}`,
    {
      fileId,
    }
  );
  try {
    const response = await axios.post(
      `${config.fileService.hostname}/${config.fileService.downloadRoute}`,
      {
        fileId,
      },
      {
        headers: {
          "Archive-Api-Key": config.fileService.archiveApiKey,
        },
      }
    );
    return response.data.FileBase64;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (axiosError && axiosError.response) {
      console.log(
        "in getFileUrl error thrown ==>",
        axiosError.response.status,
        axiosError.message
      );
      if (axiosError.response.status === 403) {
        console.log("file is not sanitized yet, returning undefined", axiosError.response);
        return undefined;
      }
      throw new FileDownloadError(
        axiosError.message,
        axiosError.response.status
      );
    } else if (axiosError && axiosError.request) {
      throw new FileDownloadError(
          `No response received from download service (Archive) --->${axiosError.message}`,
        502
      );
    } else {
      throw new FileDownloadError(
        axiosError ? axiosError.message : "Unknown download error",
        500
      );
    }
  }
};

// upload files to hatch service
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
      `${config.fileService.hostname}/${config.fileService.uploadRoute}`,
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
    return response.data.FileId;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (axiosError && axiosError.response) {
      throw new FileUploadError(axiosError.message, axiosError.response.status);
    } else if (axiosError && axiosError.request) {
      throw new FileUploadError(
        "No response received from upload service (Archive)",
        502
      );
    } else {
      throw new FileUploadError(
        axiosError ? axiosError.message : "Unknown upload error",
        500
      );
    }
  }
};
