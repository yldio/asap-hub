import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { getSignedCookies } from '@aws-sdk/cloudfront-signer';
import {
  getCloudFrontKeyPairId,
  getCloudFrontPrivateKeyParameter,
  getDemoHostname,
  getRegion,
} from './config';

export const signedCookieTtlMs = 12 * 60 * 60 * 1000;

let privateKeyPromise: Promise<string> | undefined;

const loadPrivateKey = (): Promise<string> => {
  if (!privateKeyPromise) {
    privateKeyPromise = new SSMClient({ region: getRegion() })
      .send(
        new GetParameterCommand({
          Name: getCloudFrontPrivateKeyParameter(),
          WithDecryption: true,
        }),
      )
      .then((response) => {
        const value = response.Parameter?.Value;
        if (!value) {
          throw new Error('the CloudFront signing key parameter is empty');
        }
        return value;
      })
      .catch((error) => {
        privateKeyPromise = undefined;
        throw error;
      });
  }
  return privateKeyPromise;
};

export const resetPrivateKeyCache = (): void => {
  privateKeyPromise = undefined;
};

export type SignedCookie = { name: string; value: string };

// media/ holds what a render produced and a viewer watches; projects/ holds the
// sources the studio plays while editing. Both sit behind the same key group, so
// each is signed for its own prefix and the cookie is scoped to that path
export type SignedPrefix = 'media' | 'projects';

export const buildSignedCookies = async (
  videoId: string,
  prefix: SignedPrefix = 'media',
  now: number = Date.now(),
): Promise<SignedCookie[]> => {
  const privateKey = await loadPrivateKey();
  const expires = now + signedCookieTtlMs;
  const resource = `https://${getDemoHostname()}/${prefix}/${videoId}/*`;
  const cookies = getSignedCookies({
    url: resource,
    keyPairId: getCloudFrontKeyPairId(),
    privateKey,
    policy: JSON.stringify({
      Statement: [
        {
          Resource: resource,
          Condition: {
            DateLessThan: { 'AWS:EpochTime': Math.floor(expires / 1000) },
          },
        },
      ],
    }),
  });

  return Object.entries(cookies).map(([name, value]) => ({
    name,
    value: String(value),
  }));
};
