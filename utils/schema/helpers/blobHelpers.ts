import { v4 as uuidv4 } from "uuid";
import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  SASProtocol,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { promisify } from "util";
import { writeFile, unlink } from "fs";
import * as path from "path";
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
  let blobServiceClient;
  try {
    const credential = new StorageSharedKeyCredential(accountName, accountKey);
    blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );
  } catch {
    throw new ConnectionError("Azure connection failed");
  }

  return blobServiceClient;
};

const createSasUrl = async (containerName: string, blobName: string) => {
  const HOUR = 60 * 60 * 1000;
  const NOW = new Date();

  const HOUR_BEFORE_NOW = new Date(NOW.valueOf() - HOUR);
  const HOUR_AFTER_NOW = new Date(NOW.valueOf() + HOUR);

  const userDelegationKey = await getBlobClient().getUserDelegationKey(
    HOUR_BEFORE_NOW,
    HOUR_AFTER_NOW
  );

  const sasOptions = {
    blobName,
    containerName,
    permissions: BlobSASPermissions.parse("r"),
    protocol: SASProtocol.HttpsAndHttp,
    startsOn: HOUR_BEFORE_NOW,
    expiresOn: HOUR_AFTER_NOW,
  };

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    userDelegationKey,
    accountName
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
};

const uploadFile = async (
  fileBuffer: Buffer,
  fileType: FileTypes,
  fileName = uuidv4()
) => {
  const containerName = getContainerNameByFileType(fileType);
  const containerClient = getBlobClient().getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const filePath = path.join(__dirname, "../uploads", fileName);

  // save file on the server locally
  await promisify(writeFile)(filePath, fileBuffer);

  // upload the file to azure
  await blockBlobClient.uploadFile(filePath);

  // delete the file from the server
  await promisify(unlink)(filePath);

  return fileName;
};

export const createBlob = async (fileBuffer: Buffer, fileType: FileTypes) =>
  uploadFile(fileBuffer, fileType);

export const updateBlob = async (
  fileBuffer: Buffer,
  fileType: FileTypes,
  fileName: string
) => uploadFile(fileBuffer, fileType, fileName);

export const downloadBlob = async (blobName: string, fileType: FileTypes) =>
  createSasUrl(getContainerNameByFileType(fileType), blobName);
