import { S3Client } from "@aws-sdk/client-s3";

// Centralized S3 client configuration
// Replace values below as needed or wire them to env variables
const REGION = process.env.OBJECT_STORAGE_REGION;
const ACCESS_KEY_ID = process.env.OBJECT_STORAGE_TENANT_ID + ":" + process.env.CLOUD_RU_KEY_ID;
const SECRET_ACCESS_KEY = process.env.CLOUD_RU_KEY_SECRET;
const ENDPOINT = process.env.OBJECT_STORAGE_ENDPOINT;

let cachedClient: S3Client | null = null;

export function getS3Client(): S3Client {
  if (cachedClient) return cachedClient;
  cachedClient = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY
    },
    endpoint: ENDPOINT
  });
  return cachedClient;
}


