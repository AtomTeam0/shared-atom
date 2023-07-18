import { IFileDetails } from "common-atom/interfaces/helpers/file.interface";
import { promises as fsPromises } from "fs";
import { config } from "../../../config";
import { FileConvertionError } from "../../errors/filesError";

export const getFileUrl = async (fileId: string) =>
  `${config.fileService.download.hostname}/${config.fileService.download.innerDirectory}/${config.fileService.fileNameStarter}_${fileId}`;

export const uploadFile = async (file: IFileDetails) => {
  let filebase64;
  const FileType = file.originalFilename.split(".")[1];

  try {
    const data = await fsPromises.readFile(file.filepath);
    filebase64 = data.toString("base64");
  } catch (error) {
    throw new FileConvertionError();
  }

  return fetch(
    `${config.fileService.upload.hostname}/${config.fileService.upload.route}`,
    {
      method: "POST",
      body: JSON.stringify({
        filebase64,
        projectId: config.fileService.projectId,
        FileProperties: {
          FileName: `${config.fileService.fileNameStarter}_${file.originalFilename}`,
          FileType,
        },
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then((response: any) => {
      if (!response.ok) {
        throw response.status;
      }
      return response;
    })
    .then((response: any) => response.json());
};
