import Got from 'got';
import decode from 'jwt-decode';
import { cms as squidex } from '../config';

interface JwtToken {
  exp: number;
}

let token: Promise<string> | null;
export default function create(): typeof Got {
  const refresh = (): void => {
    /* eslint-disable @typescript-eslint/camelcase */
    const url = `${squidex.baseUrl}/identity-server/connect/token`;
    const res = Got.post(url, {
      form: {
        grant_type: 'client_credentials',
        scope: 'squidex-api',
        client_id: squidex.clientId,
        client_secret: squidex.clientSecret,
      },
    }).json();
    /* eslint-enable @typescript-eslint/camelcase */

    token = res.then((r) => {
      /* eslint-disable-next-line camelcase */
      const { access_token: accessToken } = r as { access_token: string };
      return accessToken;
    });
  };

  return Got.extend({
    prefixUrl: `${squidex.baseUrl}/api/content/${squidex.appName}/`,
    headers: {
      'content-type': 'application/json',
    },
    hooks: {
      beforeRequest: [
        async (options): Promise<void> => {
          if (!token) {
            // create token if not present
            await refresh();
          }

          const tk = await token;
          if (tk) {
            const jwt = decode<JwtToken>(tk);
            const currentTime = Date.now() / 1000;

            if (currentTime < jwt.exp) {
              // recreate token if expired
              await refresh();
            }

            /* eslint-disable no-param-reassign */
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${await token}`,
            };
          }
        },
      ],
    },
  });
}
