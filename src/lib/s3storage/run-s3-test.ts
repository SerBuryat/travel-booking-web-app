import 'dotenv/config';

import {
  createBucket,
  deleteBucket,
  getBucketsList,
  getObject,
  getObjectsList,
  putObject,
} from "./s3-storage";

async function main() {
  const [, , cmd, ...args] = process.argv;

  if (!cmd) {
    printHelp();
    process.exit(1);
  }

  try {
    switch (cmd) {
      case "get-buckets": {
        await getBucketsList();
        break;
      }
      case "create-bucket": {
        const [bucket] = args;
        if (!bucket) return die("create-bucket <bucket>");
        await createBucket(bucket);
        break;
      }
      case "delete-bucket": {
        const [bucket] = args;
        if (!bucket) return die("delete-bucket <bucket>");
        await deleteBucket(bucket);
        break;
      }
      case "list-objects": {
        const [bucket] = args;
        if (!bucket) return die("list-objects <bucket>");
        await getObjectsList(bucket);
        break;
      }
      case "get-object": {
        const [bucket, key] = args;
        if (!bucket || !key) return die("get-object <bucket> <key>");
        await getObject(bucket, key);
        break;
      }
      case "put-object": {
        const [bucket, key, body = "sample body", contentType] = args;
        if (!bucket || !key) return die("put-object <bucket> <key> [body] [contentType]");
        await putObject({ bucketName: bucket, fileName: key, content: body, contentType });
        break;
      }
      default:
        printHelp();
        process.exit(1);
    }

    console.log("[S3] CLI runner completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("[S3] CLI runner failed", err);
    process.exit(1);
  }
}

function die(usage: string): never {
  console.error("Usage:", usage);
  process.exit(1);
}

function printHelp() {
  console.log("Usage:");
  console.log("  tsx src/lib/s3storage/run-s3-test.ts get-buckets");
  console.log("  tsx src/lib/s3storage/run-s3-test.ts create-bucket <bucket>");
  console.log("  tsx src/lib/s3storage/run-s3-test.ts delete-bucket <bucket>");
  console.log("  tsx src/lib/s3storage/run-s3-test.ts list-objects <bucket>");
  console.log("  tsx src/lib/s3storage/run-s3-test.ts get-object <bucket> <key>");
  console.log("  tsx src/lib/s3storage/run-s3-test.ts put-object <bucket> <key> [body] [contentType]");
}

main();

