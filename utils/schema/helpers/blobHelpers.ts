import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import { FileTypes } from "../../../enums/helpers/FileTypes";
import { UnsupportedFileType } from "../../errors/validationError";

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const IMAGE_CONTAINER_NAME = process.env.IMAGE_CONTAINER_NAME || "images";
const MP3_CONTAINER_NAME = process.env.MP3_CONTAINER_NAME || "mp3's";
const MP4_CONTAINER_NAME = process.env.MP4_CONTAINER_NAME || "mp4's";

const calcBlobName = (blobId: any, fileType: FileTypes) =>
  `${blobId}.${fileType}`;

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

const getBlockBlobClient = (
  fileType: FileTypes,
  blobName = calcBlobName(uuidv4(), fileType)
) => {
  let containerName;
  switch (fileType) {
    case FileTypes.IMAGE:
      containerName = IMAGE_CONTAINER_NAME;
      break;
    case FileTypes.MP3:
      containerName = MP3_CONTAINER_NAME;
      break;
    case FileTypes.MP4:
      containerName = MP4_CONTAINER_NAME;
      break;
    default:
      throw new UnsupportedFileType();
  }

  const containerClient = getBlobClient().getContainerClient(containerName);
  return containerClient.getBlockBlobClient(blobName);
};

export const uploadBlob = async (data: any, fileType: FileTypes) => {
  await getBlockBlobClient(fileType).upload(data);
};

export const downloadBlob = async (blobId: any, fileType: FileTypes) => {
  const downloadBlockBlobResponse = await getBlockBlobClient(
    fileType,
    calcBlobName(blobId, fileType)
  ).download(0);

  return downloadBlockBlobResponse.readableStreamBody;
};
