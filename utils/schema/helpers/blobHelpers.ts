import { v4 as uuidv4 } from "uuid";
import { DefaultAzureCredential } from "@azure/identity";
import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  SASProtocol,
  BlobSASPermissions,
} from "@azure/storage-blob";
import {
  FileTypes,
  getContainerNameByFileType,
  getMimeTypeByFileType,
} from "../../../enums/helpers/FileTypes";

const AZURE_ACCOUNT_NAME = process.env.AZURE_ACCOUNT_NAME || "";
const AZURE_ACCOUNT_KEY = process.env.AZURE_ACCOUNT_KEY || "";
const AZURE_STORAGE_CONNECTION_STRING = `DefaultEndpointsProtocol=https;AccountName=${AZURE_ACCOUNT_NAME};AccountKey=${AZURE_ACCOUNT_KEY};EndpointSuffix=core.windows.net`;

const getBlobClient = () => {
  if ((<any>global).blobClient) {
    return (<any>global).blobClient;
  }

  const blobClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  (<any>global).blobClient = blobClient;
  return blobClient;
};

const createSasUrl = async (
  accountName: string,
  containerName: string,
  blobName: string
) => {
  const HOUR = 60 * 60 * 1000;
  const NOW = new Date();

  const HOUR_BEFORE_NOW = new Date(NOW.valueOf() - HOUR);
  const HOUR_AFTER_NOW = new Date(NOW.valueOf() + HOUR);

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new DefaultAzureCredential()
  );

  const userDelegationKey = await blobServiceClient.getUserDelegationKey(
    HOUR_BEFORE_NOW,
    HOUR_AFTER_NOW
  );

  const blobPermissionsForAnonymousUser = "r";

  const sasOptions = {
    blobName,
    containerName,
    permissions: BlobSASPermissions.parse(blobPermissionsForAnonymousUser),
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

const base64ToBlob = (base64Data: string, fileType: FileTypes) => {
  const sliceSize = 1024;
  const byteCharacters = Buffer.from(base64Data, "base64").toString();
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: getMimeTypeByFileType(fileType) });
};

export const uploadBlob = async (base64Data: string, fileType: FileTypes) => {
  const containerName = getContainerNameByFileType(fileType);
  const blobName = uuidv4();
  const containerClient = getBlobClient().getContainerClient(containerName);
  const blob = base64ToBlob(base64Data, fileType);
  await containerClient.getBlockBlobClient(blobName).upload(blob);
  return blobName;
};

export const downloadBlob = async (blobId: any, fileType: FileTypes) =>
  createSasUrl(
    AZURE_ACCOUNT_NAME,
    getContainerNameByFileType(fileType),
    blobId
  );
