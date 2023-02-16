import { v4 as uuidv4 } from "uuid";
import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  SASProtocol,
  BlobSASPermissions,
  StorageSharedKeyCredential,
  StoragePipelineOptions,
} from "@azure/storage-blob";
import { promisify } from "util";
import { readFileSync, unlink } from "fs";
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
  const credential = new StorageSharedKeyCredential(accountName, accountKey);
  const options: StoragePipelineOptions = { retryOptions: { maxTries: 1 } };
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    credential,
    options
  );
  return blobServiceClient;
};

const createSasUrl = async (containerName: string, blobName: string) => {
  const HOUR = 60 * 60 * 1000;
  const NOW = new Date();

  const HOUR_BEFORE_NOW = new Date(NOW.valueOf() - HOUR);
  const HOUR_AFTER_NOW = new Date(NOW.valueOf() + HOUR);

  try {
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
  } catch {
    throw new ConnectionError("Azure accountName or accountKey are invalid");
  }
};

const uploadFile = async (
  path: string,
  fileType: FileTypes,
  fileName = uuidv4()
) => {
  try {
    const containerName = getContainerNameByFileType(fileType);
    const containerClient = getBlobClient().getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // upload the file to azure
    const buffer = readFileSync(path);
    await blockBlobClient.upload(buffer, buffer.length);

    // delete the file from the server
    await promisify(unlink)(path);

    return fileName;
  } catch {
    throw new ConnectionError("Azure accountName or accountKey are invalid");
  }
};

export const createBlob = async (path: string, fileType: FileTypes) =>
  uploadFile(path, fileType);

export const updateBlob = async (
  path: string,
  fileType: FileTypes,
  fileName: string
) => uploadFile(path, fileType, fileName);

export const downloadBlob = async (blobName: string, fileType: FileTypes) =>
  createSasUrl(getContainerNameByFileType(fileType), blobName);
