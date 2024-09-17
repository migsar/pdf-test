import { ResponseBuilder, Variables } from '@fermyon/spin-sdk';
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  CreateBucketCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';

function wrappy(originalFn, obj) {
  return async function wrapped(...args) {
    console.log('Wrapped args:');
    console.debug(JSON.stringify(args[0]));

    return originalFn.bind(obj)(...args);
  }
}

export async function handler(req, res) {
  const endpoint = Variables.get('endpoint');
  const accessKeyId = Variables.get('key_id');
  const secretAccessKey = Variables.get('secret');
  const s3config = {
    endpoint,
    region: 'us-east-005', // Required by sdk, but overwritten by endpoint
    // logger: console,
    credentials: { accessKeyId, secretAccessKey },
  };
  const s3 = new S3Client(s3config);
  s3.config.requestHandler.handle = wrappy(
    s3.config.requestHandler.handle,
    s3.config.requestHandler,
  );
  const command = new ListBucketsCommand({});

  try {
    const res = await s3.send(command);
    console.log(res);
  } catch (err) {
    console.log('Catched!');
    console.error(err);
    console.error(err.$response);
    console.error(err.$metadata);
  }

  res.send("hello universe");
}
