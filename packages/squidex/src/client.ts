import Got from 'got';
import decode from 'jwt-decode';
import Boom from '@hapi/boom';
import squidex from './config';

/* eslint-disable camelcase */

interface JwtToken {
  exp: number;
}

let token: Promise<string> | null;
export const getAccessToken = async (): Promise<string> => {
  if (token) {
    // eslint-disable-next-line no-console
    console.log('accessing the existing token');

    const tk1 = await token;
    if (tk1) {
      const jwt = decode<JwtToken>(tk1);
      const currentTime = Date.now() / 1000;

      if (currentTime > jwt.exp) {
        // eslint-disable-next-line no-console
        console.log('returning the existing token');
        return tk1;
      }
      // eslint-disable-next-line no-console
      console.log('stale token');
    }
  }

  // eslint-disable-next-line no-console
  console.log('fetching new token');

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

  if (token) {
    return token;
  }

  throw Boom.badImplementation();
};

const create = (
  clientOptions: { unpublished: boolean } = { unpublished: false },
): typeof Got => {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };

  if (clientOptions.unpublished) {
    headers['X-Unpublished'] = 'true';
  }

  return Got.extend({
    prefixUrl: `${squidex.baseUrl}/api/content/${squidex.appName}/`,
    headers,
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
};

export default create;
