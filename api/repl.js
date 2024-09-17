const sdk = require('@aws-sdk/client-s3')
const { S3Client, ListBucketsCommand } = sdk;
const config = {
  endpoint: 'https://us-southeast-1.linodeobjects.com',
  logger: console,
  region: 'us-east-1',
  disableS3ExpressSessionAuth: true,
  useArnRegion: true,
  // customUserAgent: 'lalala',
  // signingEscapePath: false,
};
const command = new ListBucketsCommand({});

function wrappy(originalFn) {
  return async function wrapped(...args) {
    console.log('Wrapped args:');
    console.debug(args);

    const res = await originalFn(...args);

    // This is for the sign. res is SignatureV4MultiRegion
    // function signWrap(originalSign) {
    //   return async function signWrapper(...signArgs) {
    //     console.log('Sign args:');
    //     console.debug(signArgs);
        
    //     const signed = await originalSign.bind(res)(args);

    //     console.debug(signed);

    //     return signed;
    //   }
    // };
    // res.sign = signWrap(res.sign);

    return res;
  }
}

s3 = new S3Client(config);
// s3.config.endpointProvider = wrappy(s3.config.endpointProvider);
s3.config.signer = wrappy(s3.config.signer);
// s3.config.httpAuthSchemeProvider = wrappy(s3.config.httpAuthSchemeProvider);

// It broke the app but allowed me to log the request
// s3.config.requestHandler.handle = wrappy(s3.config.requestHandler.handle).bind(s3.config.requestHandler)

// packages/s3-request-presigner/src/getSignedUrl.ts in sdk-js-v3
// Without - is signed only with node and not with python
// amz-sdk-invocation-id
// amz-sdk-request
// - host
// - x-amz-content-sha256
// - x-amz-date
// x-amz-user-agent
// await s3.send(command);
