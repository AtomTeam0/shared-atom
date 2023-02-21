import { v4 as uuidv4 } from "uuid";
import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  SASProtocol,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { promisify } from "util";
import { unlink } from "fs";
import {
  FileTypes,
  getContainerNameByFileType,
} from "../../../common/enums/helpers/FileTypes";
import { config } from "../../../config";
import { ConnectionError } from "../../errors/applicationError";

let blobClient: BlobServiceClient;
const accountName = config.azure.azureAccountName;
const accountKey = config.azure.azureAccountKey;

const getBlobClient = () => {
  if (blobClient) {
    return blobClient;
  }
  const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  return blobServiceClient;
};

const createSasUrl = async (containerName: string, blobName: string) => {
  const HOUR = 60 * 60 * 1000;
  const NOW = new Date();

  const HOUR_BEFORE_NOW = new Date(NOW.valueOf() - HOUR);
  const HOUR_AFTER_NOW = new Date(NOW.valueOf() + HOUR);

  try {
    const containerClient = getBlobClient().getContainerClient(containerName);
    const blobClientUrl = containerClient.getBlobClient(blobName).url;

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );

    const sasOptions = {
      containerName,
      blobName,
      startsOn: HOUR_BEFORE_NOW,
      expiresOn: HOUR_AFTER_NOW,
      permissions: BlobSASPermissions.parse("r"),
      protocol: SASProtocol.HttpsAndHttp,
    };

    const sasQueryParams = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    );

    return `${blobClientUrl}?${sasQueryParams.toString()}`;
  } catch (err: any) {
    throw new ConnectionError(`Azure error: ${err.message}`);
  }
};

const uploadFile = async (
  file: { filepath: string; originalFilename: string },
  fileType: FileTypes,
  fileName: string
) => {
  try {
    const containerName = getContainerNameByFileType(fileType);
    const containerClient = getBlobClient().getContainerClient(containerName);

    // Create container if it does not exist
    const exists = await containerClient.exists();
    if (!exists) {
      await containerClient.create({ access: "blob" });
    }
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // upload the file to azure
    await blockBlobClient.uploadFile(file.filepath);

    // delete the file from the server
    await promisify(unlink)(file.filepath);

    return fileName;
  } catch (err: any) {
    throw new ConnectionError(`Azure error: ${err.message}`);
  }
};

export const createBlob = async (
  file: { filepath: string; originalFilename: string },
  fileType: FileTypes
) => {
  const fileNameParts = file.originalFilename.split(".");
  return uploadFile(
    file,
    fileType,
    `${fileNameParts[0]}_${uuidv4()}.${fileNameParts[1]}`
  );
};

export const updateBlob = async (
  file: { filepath: string; originalFilename: string },
  fileType: FileTypes,
  fileName: string
) => uploadFile(file, fileType, fileName);

export const downloadBlob = async (blobName: string, fileType: FileTypes) =>
  createSasUrl(getContainerNameByFileType(fileType), blobName);
