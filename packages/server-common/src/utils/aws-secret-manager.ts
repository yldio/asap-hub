/* istanbul ignore file */
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

interface JWTInput {
  type?: string;
  client_email?: string;
  private_key?: string;
  private_key_id?: string;
  project_id?: string;
  client_id?: string;
  client_secret?: string;
  refresh_token?: string;
  quota_project_id?: string;
}

export type GetJWTCredentials = () => Promise<JWTInput>;

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
