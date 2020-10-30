import Got from 'got';
import decode from 'jwt-decode';
import Boom from '@hapi/boom';
import squidex from './config';

interface JwtToken {
  exp: number;
}

let token: Promise<string> | null;
export const getAccessToken = async (): Promise<string> => {
  if (token) {
    const tk1 = await token;
    if (tk1) {
      const jwt = decode<JwtToken>(tk1);
      const currentTime = Date.now() / 1000;

      if (currentTime > jwt.exp) {
        return tk1;
      }
    }
  }

  /* eslint-disable @typescript-eslint/camelcase, camelcase */
  const url = `${squidex.baseUrl}/identity-server/connect/token`;
  token = Got.post(url, {
    form: {
      grant_type: 'client_credentials',
      scope: 'squidex-api',
      client_id: squidex.clientId,
      client_secret: squidex.clientSecret,
    },
  })
    .json()
    .then((r: unknown) => {
      const { access_token: accessToken } = r as { access_token: string };
      return accessToken;
    });
  /* eslint-enable @typescript-eslint/camelcase, camelcase */

  if (token) {
    return token;
  }

  throw Boom.badImplementation();
};

export default function create(): typeof Got {
  return Got.extend({
    prefixUrl: `${squidex.baseUrl}/api/content/${squidex.appName}/`,
    headers: {
      'content-type': 'application/json',
    },
    hooks: {
      beforeRequest: [
        async (options): Promise<void> => {
          const tk = await getAccessToken();

          /* eslint-disable no-param-reassign */
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${tk}`,
          };
        },
      ],
    },
  });
}
