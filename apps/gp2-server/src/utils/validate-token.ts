import { auth0PubKeys, Auth0User, config } from '@asap-hub/auth';
import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';

const certToPEM = (cert: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  `-----BEGIN CERTIFICATE-----\n${cert
    .match(/.{1,64}/g)!
    .join('\n')}\n-----END CERTIFICATE-----\n`;
const getPublicKey = (header: JwtHeader, cb: SigningKeyCallback): void => {
  const key = auth0PubKeys.find(({ kid }) => kid === header.kid)?.x5c;
  if (!key) {
    return cb(new Error(`Unable to find Public Key with kid=${header.kid}`));
  }
  if (!key.length || !key[0]?.trim().length) {
    return cb(new Error('Received an invalid key'));
  }
  return cb(null, certToPEM(key[0]));
};

const decodeToken = (token: string): Promise<Auth0User> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, getPublicKey, { algorithms: ['RS256'] }, (err, res) => {
      if (err) {
        return reject(err);
      }

      const payload = res as Auth0User;
      if (payload?.aud !== config.clientID) {
        return reject(
          new Error(
            'Token verification: aud field doesnt match Auth0 ClientID',
          ),
        );
      }
      return resolve(payload);
    });
  });

export default decodeToken;

export type DecodeToken = typeof decodeToken;
