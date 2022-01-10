/* istanbul ignore file */
import AWSXRay from 'aws-xray-sdk';
import AWS from 'aws-sdk';
import http from 'http';
import { appFactory } from './app';

const awsXRay = AWSXRay;
awsXRay.captureHTTPsGlobal(http);
const awsSdk = awsXRay.captureAWS(AWS);

const port = 3333;
const app = appFactory({
  awsXRay,
  awsSdk,
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`ASAP server listening at http://localhost:${port}`);
});
