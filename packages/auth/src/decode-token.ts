import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import { Auth0User, config } from '.';

import pubKeys from './pubKeys';

const certToPEM = (cert: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return `-----BEGIN CERTIFICATE-----\n${cert
    .match(/.{1,64}/g)!
    .join('\n')}\n-----END CERTIFICATE-----\n`;
};

const getPublicKey = (header: JwtHeader, cb: SigningKeyCallback): void => {
  const key = pubKeys.find(({ kid }) => kid === header.kid)?.x5c;
  if (!key || !key.length) {
    return cb(new Error(`Unable to find Public Key with kid=${header.kid}`));
  }
  return cb(null, certToPEM(key[0]));
};

const decodeToken = (token: string): Promise<Auth0User> => {
  return new Promise((resolve, reject) => {
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
};

export default decodeToken;
