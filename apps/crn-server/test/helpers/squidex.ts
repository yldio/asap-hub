import nock from 'nock';
import encode from 'jwt-encode';
import { config } from '@asap-hub/squidex';

export const identity = () => {
  return nock(config.baseUrl)
    .post(
      '/identity-server/connect/token',
      `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
        config.clientId,
      )}&client_secret=${config.clientSecret}`,
    )
    .reply(200, {
      access_token: encode(
        {
          exp: Math.floor((new Date().getTime() + 3600 * 1000) / 1000),
          nbf: Math.floor(new Date().getTime() / 1000),
        },
        'secret',
      ),
      expires_in: 2592000,
      token_type: 'Bearer',
      scope: 'squidex-api',
    });
};
