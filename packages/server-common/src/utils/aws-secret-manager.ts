/* istanbul ignore file */
import { SecretsManager } from '@aws-sdk/client-secrets-manager';
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
    const client = new SecretsManager({ region });

    const secret = await client.getSecretValue({
      SecretId: googleApiCredentialsSecretId,
    });

    if (!('SecretString' in secret) || !secret.SecretString) {
      throw new Error('Invalid credentials');
    }

    return JSON.parse(secret.SecretString);
  };
