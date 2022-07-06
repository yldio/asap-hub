import { auth0PubKeys } from '@asap-hub/auth';
import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from 'jsonwebtoken';

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

export const decodeTokenFactory =
  (audience: string) =>
  (token: string): Promise<JwtPayload> =>
    new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getPublicKey,
        { algorithms: ['RS256'] },
        (err, decodedToken) => {
          if (err) {
            return reject(err);
          }

          if (
            typeof decodedToken === 'string' ||
            typeof decodedToken === 'undefined' ||
            !decodedToken.aud
          ) {
            throw new Error('Invalid JWT token');
          }

          if (!decodedToken.aud.includes(audience)) {
            return reject(
              new Error(
                'Token verification: aud field doesnt contain the API Audience',
              ),
            );
          }

          return resolve(decodedToken);
        },
      );
    });

export type DecodeToken = ReturnType<typeof decodeTokenFactory>;
