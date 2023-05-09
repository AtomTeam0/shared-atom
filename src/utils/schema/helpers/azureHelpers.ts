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
  region: config.aws.region,
  endpoint: config.aws.endpoint,
  s3ForcePathStyle: config.aws.forcePathS3,
  s3BucketEndpoint: config.aws.isBucketPoint,
});

const createBucketIfNotExists = async (bucketName: string) => {
  console.log(config);
  const params = {
    Bucket: bucketName,
  };
  try {
    await s3.headBucket(params).promise();
    console.log("managed to check if exist");
    return true;
  } catch (err: any) {
    console.log("no bucket", err);
    if (err.statusCode === 404) {
      try {
        await s3.createBucket(params).promise();
        console.log("did create");
      } catch (error: any) {
        console.log("error at create", error);
        throw error;
      }
      return true;
    }
    throw err;
  }
};

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

const uploadFile = async (
  file: IFileDetails,
  fileType: FileTypes,
  oldFileName?: string
) => {
  try {
    const fileName = getS3Name(file, oldFileName);
    const bucketName = getBucketNameByFileType(fileType);
    console.log("filename", fileName);
    console.log("bucketName", bucketName);

    // Check if bucket exists, create if not
    console.log("checking and creating");
    await createBucketIfNotExists(bucketName);
    console.log("finished create and check");

    // Upload the file to S3
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.filepath,
      ContentType: file.mimetype,
    };
    console.log("params", params);

    await s3.upload(params).promise();
    console.log("after upload");

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
    console.log("error in upload", err);
    throw new ConnectionError(`AWS error: ${err.message}`);
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
