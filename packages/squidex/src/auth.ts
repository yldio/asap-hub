import Got, { RequestError } from 'got';
import decode from 'jwt-decode';
import Debug from 'debug';
import squidex from './config';

interface JwtToken {
  exp: number;
}

const debug = Debug('squidex');

const fetchToken = async () => {
  const url = `${squidex.baseUrl}/identity-server/connect/token`;
  try {
    debug('Fetching new squidex auth token');

    const response = await Got.post(url, {
      form: {
        grant_type: 'client_credentials',
        scope: 'squidex-api',
        client_id: squidex.clientId,
        client_secret: squidex.clientSecret,
      },
    }).json<{ access_token: string }>();

    return response.access_token;
  } catch (error) {
    if (error instanceof RequestError) {
      error.message = `Request to Squidex failed (code ${error.code}), response: ${error.response?.body}`;
    }

    throw error;
  }
};

export const getAccessTokenFactory = (): (() => Promise<string>) => {
  let tokenP: Promise<string> | undefined;

  return async (): Promise<string> => {
    if (tokenP) {
      try {
        const tk1 = await tokenP;
        if (tk1) {
          const jwt = decode<JwtToken>(tk1);
          const currentTime = Date.now() / 1000;

          if (currentTime < jwt.exp) {
            debug('Using cached auth token');
            return tk1;
          }

          debug('Cached auth token expired');
        }
      } catch (error) {
        tokenP = undefined;
      }
    }

    tokenP = fetchToken();

    return tokenP;
  };
};

export type GetAccessToken = ReturnType<typeof getAccessTokenFactory>;

const create = (
  clientOptions: { unpublished: boolean } = { unpublished: false },
  getAccessToken: GetAccessToken,
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
