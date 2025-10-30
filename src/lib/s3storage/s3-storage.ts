import {
  CreateBucketCommand,
  DeleteBucketCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type CreateBucketCommandOutput,
  type DeleteBucketCommandOutput,
  type GetObjectCommandOutput,
  type ListBucketsCommandOutput,
  type ListObjectsV2CommandOutput,
  type PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getS3Client } from "./s3-client";

export type S3PutFile = {
  bucketName: string;
  fileName: string;
  content: string | Uint8Array | Buffer;
  contentType?: string;
};

// putObject(file)
export async function putObject(file: S3PutFile): Promise<PutObjectCommandOutput> {
  console.log("[S3] putObject:start", { bucket: file.bucketName, key: file.fileName });
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: file.bucketName,
    Key: file.fileName,
    Body: file.content,
    ContentType: file.contentType,
  });
  const res = await client.send(command);
  console.log("[S3] putObject:done", { status: res.$metadata.httpStatusCode, eTag: res.ETag });
  return res;
}

// getObject(bucketName, fileName)
export async function getObject(bucketName: string, fileName: string): Promise<GetObjectCommandOutput> {
  console.log("[S3] getObject:start", { bucket: bucketName, key: fileName });
  const client = getS3Client();
  const command = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
  const res = await client.send(command);
  console.log("[S3] getObject:done", {
    status: res.$metadata.httpStatusCode,
    contentType: res.ContentType,
    contentLength: res.ContentLength,
  });
  return res;
}

// getObjectsList(bucketName)
export async function getObjectsList(bucketName: string): Promise<ListObjectsV2CommandOutput> {
  console.log("[S3] getObjectsList:start", { bucket: bucketName });
  const client = getS3Client();
  const command = new ListObjectsV2Command({ Bucket: bucketName });
  const res = await client.send(command);
  console.log("[S3] getObjectsList:done", { status: res.$metadata.httpStatusCode, count: res.Contents?.length || 0 });
  return res;
}

// getBucketsList()
export async function getBucketsList(): Promise<ListBucketsCommandOutput> {
  console.log("[S3] getBucketsList:start");
  const client = getS3Client();
  const command = new ListBucketsCommand({});
  const res = await client.send(command);
  console.log("[S3] getBucketsList:done", { status: res.$metadata.httpStatusCode, count: res.Buckets?.length || 0 });
  return res;
}

// createBucket(bucketName)
export async function createBucket(bucketName: string): Promise<CreateBucketCommandOutput> {
  console.log("[S3] createBucket:start", { bucket: bucketName });
  const client = getS3Client();
  const command = new CreateBucketCommand({ Bucket: bucketName });
  const res = await client.send(command);
  console.log("[S3] createBucket:done", { status: res.$metadata.httpStatusCode, location: res.Location });
  return res;
}

// deleteBucket(bucketName)
export async function deleteBucket(bucketName: string): Promise<DeleteBucketCommandOutput> {
  console.log("[S3] deleteBucket:start", { bucket: bucketName });
  const client = getS3Client();
  const command = new DeleteBucketCommand({ Bucket: bucketName });
  const res = await client.send(command);
  console.log("[S3] deleteBucket:done", { status: res.$metadata.httpStatusCode });
  return res;
}


