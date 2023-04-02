import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  SASProtocol,
  BlobSASPermissions,
  StorageSharedKeyCredential,
  BlobSASSignatureValues,
} from "@azure/storage-blob";
import { promisify } from "util";
import { unlink } from "fs";
import { FileTypes } from "common-atom/enums/helpers/FileTypes";
import { IFileDetails } from "common-atom/interfaces/helpers/file.interface";
import { config } from "../../../config";
import { ConnectionError } from "../../errors/applicationError";
import {
  getContainerNameByFileType,
  getBlobName,
  getMimetypeByBlobName,
} from "../../helpers/files";

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

const createSasUrl = async (fileType: FileTypes, blobName: string) => {
  const HOUR = 60 * 60 * 1000;
  const NOW = new Date();

  const HOUR_BEFORE_NOW = new Date(NOW.valueOf() - HOUR);
  const HOUR_AFTER_NOW = new Date(NOW.valueOf() + HOUR);

  try {
    const containerName = getContainerNameByFileType(fileType);
    const containerClient = getBlobClient().getContainerClient(containerName);
    const blobClientUrl = containerClient.getBlobClient(blobName).url;

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );

    const sasOptions: BlobSASSignatureValues = {
      containerName,
      blobName,
      startsOn: HOUR_BEFORE_NOW,
      expiresOn: HOUR_AFTER_NOW,
      permissions: BlobSASPermissions.parse("r"),
      protocol: SASProtocol.HttpsAndHttp,
      contentDisposition: "inline",
      contentType: getMimetypeByBlobName(blobName),
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
  file: IFileDetails,
  fileType: FileTypes,
  oldFileName?: string
) => {
  try {
    const fileName = getBlobName(file, oldFileName);
    const containerName = getContainerNameByFileType(fileType);
    const containerClient = getBlobClient().getContainerClient(containerName);

    // Create container if it does not exist
    const exists = await containerClient.exists();
    if (!exists) {
      await containerClient.create({ access: "blob" });
    }

    // upload the file to azure, if old blob is given, delete it
    if (oldFileName) {
      const oldBlockBlobClient =
        containerClient.getBlockBlobClient(oldFileName);
      oldBlockBlobClient.deleteIfExists();
    }
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadFile(file.filepath);

    // delete the file from the local server
    await promisify(unlink)(file.filepath);

    return fileName;
  } catch (err: any) {
    throw new ConnectionError(`Azure error: ${err.message}`);
  }
};

export const createBlob = async (file: IFileDetails, fileType: FileTypes) =>
  uploadFile(file, fileType);

export const updateBlob = async (
  file: IFileDetails,
  fileType: FileTypes,
  oldFileName: string
) => uploadFile(file, fileType, oldFileName);

export const downloadBlob = async (blobName: string, fileType: FileTypes) =>
  createSasUrl(fileType, blobName);
