/* istanbul ignore file */
import AWS from 'aws-sdk';
import { Auth } from 'googleapis';

export type GetJWTCredentials = () => Promise<Auth.JWTInput>;

export const getJWTCredentialsFactory =
  ({
    googleApiCredentialsSecretId,
    region,
  }: {
    googleApiCredentialsSecretId: string;
    region: string;
  }): GetJWTCredentials =>
  async () => {
    const client = new AWS.SecretsManager({ region });

    const secret = await client
      .getSecretValue({ SecretId: googleApiCredentialsSecretId })
      .promise();

    if (!('SecretString' in secret) || !secret.SecretString) {
      throw new Error('Invalid credentials');
    }

    return JSON.parse(secret.SecretString);
  };
