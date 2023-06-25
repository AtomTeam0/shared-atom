import * as AWS from "aws-sdk";
import { promisify } from "util";
import { unlink } from "fs";
import { FileTypes } from "common-atom/enums/helpers/FileTypes";
import { IFileDetails } from "common-atom/interfaces/helpers/file.interface";
import { config } from "../../../config";
import { ConnectionError } from "../../errors/applicationError";
import { getBucketNameByFileType, getS3Name } from "../../helpers/files";

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  ...(config.aws.region !== config.aws.defaultRegion && {
    region: config.aws.region,
  }),
  endpoint: config.aws.endpoint,
  s3ForcePathStyle: config.aws.forcePathS3,
  s3BucketEndpoint: config.aws.isBucketPoint,
});

const createSasUrl = async (fileType: FileTypes, objectKey: string) => {
  const HOUR = 60 * 60; // 1 hour in seconds
  try {
    const bucketName = getBucketNameByFileType(fileType);
    const objectUrl = s3.getSignedUrl("getObject", {
      Bucket: bucketName,
      Key: objectKey,
      Expires: HOUR,
    });
    return objectUrl;
  } catch (err: any) {
    throw new ConnectionError(`S3 error: ${err.message}`);
  }
};

const checkIfExistAndCreateBucket = async (bucketName: string) => {
  const existingBuckets: AWS.S3.Bucket[] | undefined = (
    await s3.listBuckets().promise()
  ).Buckets;
  if (
    !existingBuckets?.length ||
    !existingBuckets.some((bucket: AWS.S3.Bucket) => bucket.Name === bucketName)
  )
    await s3.createBucket({ Bucket: bucketName }).promise();
};

const uploadFile = async (
  file: IFileDetails,
  fileType: FileTypes,
  oldFileName?: string
) => {
  try {
    const fileName = getS3Name(file, oldFileName);
    const bucketName = getBucketNameByFileType(fileType);

    // Create Bucket if does not exist
    await checkIfExistAndCreateBucket(bucketName);

    // Upload the file to S3
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.filepath,
      ContentType: file.mimetype,
    };
    await s3.upload(params).promise();

    // Delete the old file if provided
    if (oldFileName) {
      const deleteParams = {
        Bucket: bucketName,
        Key: oldFileName,
      };
      await s3.deleteObject(deleteParams).promise();
    }

    // Delete the file from the local server
    await promisify(unlink)(file.filepath);

    return fileName;
  } catch (err: any) {
    throw new ConnectionError(`S3 error: ${err.message}`);
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
