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

export const uploadBlob = async (data: any, fileType: FileTypes) => {
  const containerName = getContainerNameByFileType(fileType);
  const blobName = uuidv4();
  const containerClient = getBlobClient().getContainerClient(containerName);
  await containerClient.getBlockBlobClient(blobName).upload(data);
  return blobName;
};

export const downloadBlob = async (blobId: any, fileType: FileTypes) =>
  createSasUrl(
    AZURE_ACCOUNT_NAME,
    getContainerNameByFileType(fileType),
    blobId
  );
