/* istanbul ignore file */
import AWS from 'aws-sdk';
import { Auth } from 'googleapis';

import { region, googleApiCredentialsSecretId } from '../config';

const getJWTCredentials: GetJWTCredentials = async () => {
  const client = new AWS.SecretsManager({ region });

  const secret = await client
    .getSecretValue({ SecretId: googleApiCredentialsSecretId })
    .promise();

  if (!('SecretString' in secret) || !secret.SecretString) {
    throw new Error('Invalid credentials');
  }

  return JSON.parse(secret.SecretString);
};

export type GetJWTCredentials = () => Promise<Auth.JWTInput>;
export default getJWTCredentials;
