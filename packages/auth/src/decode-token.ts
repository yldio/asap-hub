import { default as jwt, JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import { Auth0User } from '.';

import pubKeys from './pubKeys';

const getPublicKey = (header: JwtHeader, cb: SigningKeyCallback): void => {
  const key = pubKeys.find(({ kid }) => kid === header.kid)?.x5c;
  return key ? cb(null, key[0]) : cb(new Error());
};

const decodeToken = (token: string): Promise<Auth0User> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getPublicKey, { algorithms: ['RS256'] }, (err, res) => {
      if (err) {
        return reject(err);
      }
      const { payload } = res as { payload: Auth0User };
      return resolve(payload);
    });
  });
};

export default decodeToken;
